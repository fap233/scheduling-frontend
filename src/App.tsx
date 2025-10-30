import React, { useEffect, useState } from "react";

interface Scheduling {
	id: number;
	clientName: string;
	email: string;
	phone: string;
	schedule: string;
}

const API_URL = "http://localhost:5046/scheduling";

function App() {
	const [schedules, setSchedules] = useState<Scheduling[]>([]);
	const [loading, setLoading] = useState(true);

	const [formData, setFormData] = useState({
		clientName: "",
		email: "",
		phone: "",
		schedule: "",
	});

	const [message, setMessage] = useState("");

	async function loadSchedules() {
		setLoading(true);
		setMessage("");

		try {
			const response = await fetch(API_URL);
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const data: Scheduling[] = await response.json();

			setSchedules(data);
		} catch (error) {
			console.error("Not possible to reach the schedules:", error);
			setMessage("Error to load schedules.");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		loadSchedules();
	}, []);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage("Salvando...");

		const newSchedulingData = {
			id: 0,
			...formData,
		};

		try {
			const response = await fetch(API_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newSchedulingData),
			});

			if (response.status === 409) {
				const errorText = await response.text();
				throw new Error(errorText);
			}

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			setMessage("Success saving scheduling!");
			setFormData({ clientName: "", email: "", phone: "", schedule: "" });
			loadSchedules();
		} catch (error) {
			console.error("Error saving scheduling", error);
			if (error instanceof Error) {
				setMessage(`Error: ${error.message}`);
			} else {
				setMessage("Unknown error.");
			}
		}
	};

	if (loading) {
		return <div>Loading schedules...</div>;
	}

	return (
		<div>
			<h1>My Schedulings</h1>
			<hr />
			<h2>New Scheduling</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label>Nome: </label>
					<input
						type="text"
						name="clientName"
						value={formData.clientName}
						onChange={handleInputChange}
						required
					/>
				</div>
				<div>
					<label>Email: </label>
					<input
						type="email"
						name="email"
						value={formData.email}
						onChange={handleInputChange}
					/>
				</div>
				<div>
					<label>Phone: </label>
					<input
						type="tel"
						name="phone"
						value={formData.phone}
						onChange={handleInputChange}
					/>
				</div>
				<div>
					<label>Date: </label>
					<input
						type="datetime-local"
						name="schedule"
						value={formData.schedule}
						onChange={handleInputChange}
					/>
				</div>
				<button type="submit">Save</button>
			</form>

			{message && <p>{message}</p>}
			<hr />

			<h2>Actual Schedulings</h2>
			{loading ? (
				<div>Loading...</div>
			) : (
				<ul>
					{schedules.map((item) => (
						<li key={item.id}>
							<strong>{item.clientName}</strong> ({item.email})
							<br />
							Date: {new Date(item.schedule).toLocaleString("pt-BR")}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default App;
