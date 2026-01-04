import { useState } from 'react';
import { UploadCloud, Zap, CheckCircle2, AlertTriangle, RefreshCw, FileImage, ShieldCheck, AlertOctagon, Car, Info, ChevronRight, Download, Share2, Wrench, PhoneCall } from 'lucide-react';
import './index.css';

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [step, setStep] = useState(1); // 1: Upload, 2: Analyze, 3: Results

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setStep(2); // Move to "Ready to Analyze"
  };

  const analyzeImage = async () => {
    if (!image) return;
    setAnalyzing(true);

    // Simulate a slight delay for better UX if needed, or just go straight
    try {
      const formData = new FormData();
      formData.append('file', image);

      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        alert("Error analyzing image");
        return;
      }

      // Parse Details
      const vehicleType = data.details.find(d => d.startsWith('Identified as:'))?.replace('Identified as: ', '') || 'Unknown Vehicle';
      const observations = data.details.filter(d => !d.startsWith('Identified as:'));

      setResult({
        isLegal: data.is_legal,
        confidence: data.confidence,
        vehicleType,
        observations,
        rawDetails: data.details
      });
      setStep(3); // Move to Results
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Failed to connect to AI server. Make sure backend is running.");
      setStep(2); // Revert on failure
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setStep(1);
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6">
      {/* Background Shapes */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-pink-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      <main className="w-full max-w-5xl z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

        {/* Header Section */}
        <div className="md:col-span-12 text-center mb-6 animate-fade-up">
          <h1 className="text-5xl font-bold mb-2 tracking-tighter">
            <span className="text-gradient">AutoSafe</span> AI
          </h1>
          <p className="text-lg text-secondary max-w-xl mx-auto">
            Advanced AI diagnostics for vehicle legality & damage.
          </p>
        </div>

        {/* Workflow Steps Indicator */}
        <div className="md:col-span-12 flex justify-center mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center space-x-3 bg-white/50 backdrop-blur-md px-6 py-2 rounded-full shadow-sm border border-white/60">
            {[
              { id: 1, label: 'Upload' },
              { id: 2, label: 'Analyze' },
              { id: 3, label: 'Results' }
            ].map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-colors ${step >= s.id ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                  {s.id}
                </div>
                <span className={`ml-2 text-xs font-medium ${step >= s.id ? 'text-gray-800' : 'text-gray-400'}`}>
                  {s.label}
                </span>
                {i < 2 && <div className="w-6 h-[1px] mx-3 bg-gray-200"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Left Column: Input */}
        <div className="md:col-span-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div
            className={`glass-panel p-6 h-full min-h-[350px] flex flex-col items-center justify-center text-center transition-all ${!preview ? 'border-dashed border-2 border-indigo-200 hover:border-indigo-400 bg-white/40' : ''
              }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {preview ? (
              <div className="relative w-full h-full flex flex-col">
                <div className="relative flex-1 w-full rounded-2xl overflow-hidden shadow-md mb-4 group max-h-[300px]">
                  <img src={preview} alt="Vehicle Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={resetAnalysis}
                      className="bg-white/90 text-red-500 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-white flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" /> Change Photo
                    </button>
                  </div>
                </div>

                {step === 2 && !analyzing && (
                  <button onClick={analyzeImage} className="btn-primary w-full justify-center text-base py-3 shadow-indigo-500/20">
                    Run Analysis
                    <Zap className="w-4 h-4 ml-2" />
                  </button>
                )}

                {analyzing && (
                  <div className="flex flex-col items-center py-2">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <span className="text-indigo-600 text-sm font-medium animate-pulse">Processing Image...</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4 shadow-inner text-indigo-500">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Upload Photo</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-[200px]">Drag & drop or browse</p>
                <label className="btn-primary cursor-pointer hover-scale py-2.5 px-6 text-sm flex items-center gap-2">
                  <FileImage className="w-4 h-4" /> Browse Files
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileInput} />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="md:col-span-8 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <div className="glass-panel p-6 h-full min-h-[400px] flex flex-col relative overflow-hidden">
            {!result ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Zap className="w-16 h-16 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-400">Analysis Pending</h3>
                <p className="text-gray-400 text-sm max-w-xs">Results will appear here.</p>
              </div>
            ) : (
              <div className="h-full flex flex-col animate-fade-up">

                {/* Result Header Banner */}
                <div className={`-mx-6 -mt-6 p-6 mb-6 flex items-center justify-between text-white shadow-lg ${result.isLegal ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-pink-600'
                  }`}>
                  <div>
                    <div className="flex items-center gap-2 opacity-90 mb-1">
                      {result.isLegal ? <ShieldCheck className="w-4 h-4" /> : <AlertOctagon className="w-4 h-4" />}
                      <span className="text-xs font-bold uppercase tracking-widest">Final Verdict</span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">
                      {result.isLegal ? 'Road Legal' : 'Strict Action Required'}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-bold">{(result.confidence * 100).toFixed(0)}%</span>
                    <p className="text-xs opacity-80 uppercase font-semibold">Safety Score</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                  {/* Left Sub-column: Observations */}
                  <div className="space-y-6">
                    {/* Vehicle Type Card */}
                    <div className="bg-white/60 p-4 rounded-xl border border-white/50 shadow-sm flex items-start gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
                        <Car className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Vehicle Identified</p>
                        <h3 className="text-lg font-bold text-gray-800 capitalize">{result.vehicleType}</h3>
                        <p className="text-xs text-secondary">AI Confidence: {(result.confidence * 100).toFixed(0)}%</p>
                      </div>
                    </div>

                    {/* Checklist */}
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
                        <Info className="w-4 h-4" /> Inspection Points
                      </h4>
                      <div className="space-y-2">
                        {result.observations.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-white/40 rounded-lg border border-white/50">
                            {result.isLegal ?
                              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> :
                              <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0" />
                            }
                            <span className="text-sm font-medium text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Sub-column: Recommendations */}
                  <div className="flex flex-col h-full">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
                      Recommended Actions
                    </h4>
                    <div className="flex-1 space-y-3">
                      {result.isLegal ? (
                        <>
                          <button className="w-full p-4 bg-indigo-50 hover:bg-indigo-100 border-indigo-200 border rounded-xl flex items-center gap-4 transition-colors group text-left">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                              <Download className="w-5 h-5" />
                            </div>
                            <div>
                              <h5 className="font-bold text-indigo-900">Download Cert</h5>
                              <p className="text-xs text-indigo-600">Get your compliance report</p>
                            </div>
                            <ChevronRight className="w-5 h-5 ml-auto text-indigo-300" />
                          </button>
                          <button className="w-full p-4 bg-white hover:bg-gray-50 border-gray-200 border rounded-xl flex items-center gap-4 transition-colors group text-left">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 shadow-sm group-hover:scale-110 transition-transform">
                              <Share2 className="w-5 h-5" />
                            </div>
                            <div>
                              <h5 className="font-bold text-gray-800">Share Results</h5>
                              <p className="text-xs text-gray-500">Send to insurance/authorities</p>
                            </div>
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="w-full p-4 bg-red-50 hover:bg-red-100 border-red-200 border rounded-xl flex items-center gap-4 transition-colors group text-left">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-600 shadow-sm group-hover:scale-110 transition-transform">
                              <Wrench className="w-5 h-5" />
                            </div>
                            <div>
                              <h5 className="font-bold text-red-900">Locate Mechanic</h5>
                              <p className="text-xs text-red-600">Find nearby authorized repair</p>
                            </div>
                            <ChevronRight className="w-5 h-5 ml-auto text-red-300" />
                          </button>
                          <button className="w-full p-4 bg-white hover:bg-gray-50 border-gray-200 border rounded-xl flex items-center gap-4 transition-colors group text-left">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 shadow-sm group-hover:scale-110 transition-transform">
                              <PhoneCall className="w-5 h-5" />
                            </div>
                            <div>
                              <h5 className="font-bold text-gray-800">Contact Support</h5>
                              <p className="text-xs text-gray-500">24/7 Roadside Assistance</p>
                            </div>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-4 border-t border-gray-200/50 flex justify-between items-center px-2">
                  <button onClick={resetAnalysis} className="text-gray-400 hover:text-indigo-500 text-xs font-medium transition-colors flex items-center">
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Start New Analysis
                  </button>
                  <span className="text-[10px] text-gray-400">Powered by AutoSafe AI v1.0</span>
                </div>

              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
