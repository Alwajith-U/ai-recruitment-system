import { useEffect, useState } from "react";

function History() {

    const [history, setHistory] = useState([]);

    useEffect(() => {

        fetch("https://ai-recruitment-system-sano.onrender.com/history")
            .then(res => res.json())
            .then(data => {
                setHistory(data);
            });

    }, []);

    return (

        <div className="p-6">

            <h2 className="text-2xl font-bold mb-6">
                Recruitment History
            </h2>

            <table className="w-full border">

                <thead>
                    <tr className="bg-gray-100">
                        <th>Date</th>
                        <th>Top Candidate</th>
                        <th>Score</th>
                        <th>Total Candidates</th>
                    </tr>
                </thead>

                <tbody>

                    {history.map((item, index) => (

                        <tr key={index} className="border-t">

                            <td>{item.date}</td>

                            <td>{item.top_candidate}</td>

                            <td>{item.top_score}%</td>

                            <td>{item.total_candidates}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default History;