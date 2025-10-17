import { useEffect, useState } from "react";
import axios from "axios";

interface Customer {
  id: number;
  name: string;
  email: string;
  subscription: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    axios.get("http://localhost:8000/analytics/category")
      .then((res) => {
        const data = res.data.categories || [];
        setCustomers(data);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      <ul className="space-y-2">
        {customers.map((c: any, i: number) => (
          <li key={i} className="border p-2 rounded">
            <p className="font-semibold">{c.name || "Customer"}</p>
            <p>Email: {c.email || "N/A"}</p>
            <p>Subscription: {c.subscription || "Free"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
