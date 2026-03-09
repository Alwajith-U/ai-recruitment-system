import JobForm from '../components/job/JobForm';

function JobDescription() {
    return (
        <div className="max-w-3xl mx-auto py-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#1e293b]">Create New Posting</h1>
                <p className="text-[#64748b] mt-1">Step 1: Set up the job description for our AI analyzer</p>
            </div>

            <JobForm />
        </div>
    );
}

export default JobDescription;
