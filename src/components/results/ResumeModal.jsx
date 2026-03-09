function ResumeModal({ candidate, onClose }) {

    if (!candidate) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

            <div className="bg-white w-[80%] h-[80%] rounded-xl shadow-xl relative">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500"
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold p-4 border-b">
                    {candidate.name} Resume
                </h2>

                <iframe
                    src={candidate.resume_url}
                    title="Resume"
                    className="w-full h-[90%]"
                ></iframe>

            </div>

        </div>
    )
}

export default ResumeModal