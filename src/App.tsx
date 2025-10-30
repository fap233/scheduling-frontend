import { useEffect, useState } from "react";

interface Scheduling {
	id: number;
	clientName: string;
	email: string;
	phone: string;
	schedule: string;
}

function App() {
	const [schedules, setSchedules] = useState<Scheduling[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const apiUrl = "http://localhost:5046/scheduling";

		async function fetchSchedules() {
			try {
				const response = await fetch(apiUrl);
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				const data: Scheduling[] = await response.json();

				setSchedules(data);
			} catch (error) {
				console.error("Not possible to reach the schedules:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchSchedules();
	}, []);

	if (loading) {
		return <div>Loading schedules...</div>;
	}

	return (
		<div>
			<h1>My Schedulings</h1>
			<hr />
			<ul>
				{schedules.map((item) => (
					<li key={item.id}>
						<strong>{item.clientName}</strong> ({item.email})
						<br />
						Date: {new Date(item.schedule).toLocaleString("pt-BR")}
					</li>
				))}
			</ul>
		</div>
	);
}

export default App;
