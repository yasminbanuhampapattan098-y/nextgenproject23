import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Download, 
  Eye, 
  FileCheck, 
  X, 
  Copy, 
  Check, 
  Share2, 
  Plus, 
  FileText,
  Printer
} from 'lucide-react';
import { DocumentRecord, StudentProfile } from '../../types/student';

interface DocumentVaultViewProps {
  documents: DocumentRecord[];
  profile: StudentProfile;
  onRequestNewDocument: (doc: DocumentRecord) => void;
}

export const DocumentVaultView: React.FC<DocumentVaultViewProps> = ({
  documents,
  profile,
  onRequestNewDocument,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  // Form for requesting a new official document
  const [requestTitle, setRequestTitle] = useState('Official Term Enrollment Verification Letter');
  const [requestCategory, setRequestCategory] = useState<'Transcript' | 'Verification' | 'Certification' | 'Financial'>('Verification');
  const [purpose, setPurpose] = useState('');

  const handleCopyHash = (hash: string) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleGenerateOfficialDoc = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc: DocumentRecord = {
      id: `doc-${Date.now()}`,
      title: requestTitle,
      category: requestCategory,
      issueDate: new Date().toISOString().split('T')[0],
      issuer: 'University Digital Credential Authority',
      verificationHash: `SHA256: ${Array.from({ length: 48 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      fileSize: '210 KB',
      fileType: 'PDF',
      status: 'Official',
      description: purpose || 'Official signed student credential generated through NextGen Cloud Portal.',
    };

    onRequestNewDocument(newDoc);
    setIsRequestModalOpen(false);
    setSelectedDoc(newDoc);
  };

  const handlePrintDocument = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-indigo-400">Cryptographic Credential Locker</span>
              <span aria-hidden="true">·</span>
              <span>Registrar-Verified Electronic Transcripts</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white mt-1">
              Cloud Document & Verification Vault
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Tamper-evident, cryptographically verifiable academic records, digital degree seals, and official certificates for fellowship and graduate applications.
            </p>
          </div>

          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Official Certificate</span>
          </button>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors"
          >
            <div>
              {/* Metadata strip (zero pill discipline) */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono tabular-nums">
                <span className="text-indigo-400 font-semibold">{doc.category}</span>
                <span>Issued {doc.issueDate}</span>
              </div>

              <h4 className="text-base font-bold text-white mb-1">
                {doc.title}
              </h4>

              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {doc.description}
              </p>

              <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5 space-y-1.5 font-mono text-[11px] mb-4">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Issuer Authority:</span>
                  <span className="text-slate-200 truncate max-w-[200px]">{doc.issuer}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Document Hash:</span>
                  <span className="text-emerald-400 truncate max-w-[180px]">{doc.verificationHash.slice(0, 24)}...</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[11px]">{doc.fileType} · {doc.fileSize}</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect & Verify</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document Inspector Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl my-8">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">
                  Cryptographically Verified Credential
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintDocument}
                  title="Print official document"
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Certificate Sheet (Official Clean Paper Aesthetic inside Dark Frame) */}
            <div className="p-8 bg-slate-950 text-slate-100 space-y-6 print:bg-white print:text-black">
              {/* Institutional Header */}
              <div className="text-center pb-6 border-b border-slate-800 space-y-1">
                <h1 className="text-lg font-bold tracking-tight text-white uppercase">
                  Cloud University System
                </h1>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">
                  Office of the Registrar & Academic Credentials Authority
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  Certified Cloud Services · Serial ID: {selectedDoc.id.toUpperCase()}
                </p>
              </div>

              {/* Title & Issue Info */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 block">
                  Official Record Document
                </span>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {selectedDoc.title}
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedDoc.description}
                </p>
              </div>

              {/* Verified Student Details Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono text-xs space-y-2">
                <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Student Name:</span>
                  <span className="text-white font-bold">{profile.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-800/80">
                  <span className="text-slate-400">University ID:</span>
                  <span className="text-white">{profile.studentId}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Academic Program:</span>
                  <span className="text-white">{profile.major}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Cumulative GPA:</span>
                  <span className="text-emerald-400 font-bold">{profile.cumulativeGpa.toFixed(2)} / 4.00</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-slate-400">Completed Credits:</span>
                  <span className="text-white">{profile.completedCredits} / {profile.totalCreditsRequired} ECTS</span>
                </div>
              </div>

              {/* Cryptographic Seal Block */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Digital Blockchain Timestamp & Verification
                  </span>
                  <button
                    onClick={() => handleCopyHash(selectedDoc.verificationHash)}
                    className="text-indigo-400 hover:text-indigo-300 text-[11px] flex items-center gap-1 font-mono"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHash ? 'Hash Copied!' : 'Copy Hash'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 font-mono break-all bg-slate-950 p-2 rounded border border-slate-800">
                  {selectedDoc.verificationHash}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Signatory: {selectedDoc.issuer}</span>
                  <span>Issued: {selectedDoc.issueDate}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-xs">
                Certified valid for employer and graduate admissions verification.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintDocument}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download / Print Verified PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Official Document Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Request Certified University Document
                  </h3>
                  <p className="text-xs text-slate-400">
                    NextGen Cloud Official Registrar Service
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateOfficialDoc} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Document Type
                </label>
                <select
                  value={requestCategory}
                  onChange={(e) => setRequestCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Verification">Official Enrollment & Degree Candidacy Letter</option>
                  <option value="Transcript">Sealed Official Cumulative Transcript (PDF)</option>
                  <option value="Certification">Cloud Honors Track Credential Certificate</option>
                  <option value="Financial">Financial Aid & Scholarship Good Standing Verification</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  value={requestTitle}
                  onChange={(e) => setRequestTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Recipient Organization / Purpose
                </label>
                <textarea
                  rows={3}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. For National Science Foundation Fellowship application and employer background verification..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm"
                >
                  Generate & Add to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
