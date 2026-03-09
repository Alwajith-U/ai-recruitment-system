import ResumeUploader from '../components/resume/ResumeUploader';

function UploadResumes() {
    return (
        <div className="max-w-3xl mx-auto py-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#1e293b]">Upload Resumes</h1>
                <p className="text-[#64748b] mt-1">Step 2: Provide the candidates to evaluate</p>
            </div>

            <ResumeUploader />
        </div>
    );
}

export default UploadResumes;
