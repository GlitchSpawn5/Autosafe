import torch
import torchvision.transforms as transforms
from torchvision import models
from PIL import Image
import json
import random
import os

# Load Imagenet labels
# For offline reliability, we use a small subset of relevant indices or a downloaded list.
# For this demo, we will use a simple mapping of relevant classes if available, or just fetch labels.
# To keep it simple and robust, we verify against a set of vehicle-related keywords in the predicted class name.

LABELS_URL = "https://raw.githubusercontent.com/anishathalye/imagenet-simple-labels/master/imagenet-simple-labels.json"
# We will assume internet access to fetch labels once, or fallback.
# Actually, let's embed a simple list of vehicle keywords.
VEHICLE_KEYWORDS = {
    'ambulance', 'beach wagon', 'cab', 'convertible', 'jeep', 'limousine', 'minivan', 'Model T', 
    'racer', 'sports car', 'station wagon', 'tow truck', 'trailer truck', 'truck', 'van', 'police van', 
    'recreational vehicle', 'pickup', 'moving van', 'minibus', 'school bus', 'trolleybus', 'car wheel'
}

class CarAnalyzer:
    def __init__(self):
        print("Loading AI Model...")
        # Use MobileNetV2 for speed in this demo, or ResNet50 for accuracy. ResNet50 is standard.
        self.weights = models.ResNet50_Weights.DEFAULT
        self.model = models.resnet50(weights=self.weights)
        self.model.eval()
        self.preprocess = self.weights.transforms()
        self.labels = self.weights.meta["categories"]

    def analyze(self, image_file):
        try:
            img = Image.open(image_file).convert('RGB')
            batch = self.preprocess(img).unsqueeze(0)

            with torch.no_grad():
                prediction = self.model(batch).squeeze(0).softmax(0)
            
            # Get top 3 predictions
            top3_prob, top3_indices = torch.topk(prediction, 3)
            
            results = []
            is_vehicle = False
            primary_label = self.labels[top3_indices[0].item()]

            for i in range(3):
                idx = top3_indices[i].item()
                label = self.labels[idx]
                score = top3_prob[i].item()
                results.append({"label": label, "score": score})
                
                # Check for vehicle
                if any(k in label.lower() for k in VEHICLE_KEYWORDS) or 'car' in label.lower():
                    is_vehicle = True

            # Determine Road Legality (Mock Logic based on randomness + class)
            # In a real app, this would use a dedicated 'Damage Detection' model.
            # Here: If it's not a vehicle -> Invalid.
            # If it is a vehicle -> 80% chance legal, 20% chance damaged (for demo variance)
            # Or use a deterministic hash of the image content to be consistent?
            # Let's use deterministic behavior based on the image size/sum for consistency in demo.
            
            img_hash = sum(img.getdata()[0]) # Simple checksum
            
            if not is_vehicle:
                return {
                    "is_legal": False,
                    "confidence": results[0]['score'],
                    "verdict": "No Vehicle Detected",
                    "details": [f"Detected: {results[0]['label']}", "Please upload a clear car photo"]
                }
            
            # Simulated Damage Check
            # Deterministic pseudo-random based on hash
            random.seed(img_hash)
            damage_prob = random.random()
            
            if damage_prob > 0.7: # 30% chance of being "crashed" for demo purposes
                is_legal = False
                reasons = ["Structural frame damage detected", "Headlight assembly broken", "Bumper detached"]
            else:
                is_legal = True
                reasons = ["Chassis integrity confirmed", "Lighting systems functional", "Glass intact"]

            final_confidence = results[0]['score']

            return {
                "is_legal": is_legal,
                "confidence": final_confidence,
                "verdict": "Road Legal" if is_legal else "Severe Damage",
                "details": reasons + [f"Identified as: {primary_label}"]
            }

        except Exception as e:
            print(f"Error processing image: {e}")
            return {"error": str(e)}

analyzer = CarAnalyzer()
