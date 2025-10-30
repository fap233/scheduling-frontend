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
}

useEffect(() => {
  const apiUrl = 'http://localhost:5046/scheduling';

  async function fetchSchedules() {
    try {
     
    }
  }
})
