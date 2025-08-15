import React, { useState } from "react";
import Input from "./Input";
import { User, Mail, Lock, Calendar, Phone, Clock, Upload, Search } from "lucide-react";

const InputShowcase = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", startDate: "", endDate: "", reason: "", search: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const handleSubmit = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name required";
    if (!form.email) newErrors.email = "Email required";
    else if (!validateEmail(form.email)) newErrors.email = "Invalid email";
    if (!form.password) newErrors.password = "Password required";
    setErrors(newErrors);
    if (!Object.keys(newErrors).length) alert("Form submitted successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Input Showcase</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Full Name" placeholder="John Doe" leftIcon={<User />} value={form.name} onChange={handleChange("name")} error={errors.name} required />
        <Input label="Email" placeholder="john@example.com" leftIcon={<Mail />} value={form.email} onChange={handleChange("email")} error={errors.email} required />
        <Input label="Password" placeholder="Password" leftIcon={<Lock />} value={form.password} onChange={handleChange("password")} required type="password" showPasswordToggle />
        <Input label="Phone" placeholder="+1 (555) 123-4567" leftIcon={<Phone />} value={form.phone} onChange={handleChange("phone")} />
        <Input label="Start Date" leftIcon={<Calendar />} type="date" value={form.startDate} onChange={handleChange("startDate")} />
        <Input label="End Date" leftIcon={<Calendar />} type="date" value={form.endDate} onChange={handleChange("endDate")} />
        <Input label="Preferred Time" leftIcon={<Clock />} type="time" />
        <Input label="Search Employee" leftIcon={<Search />} value={form.search} onChange={handleChange("search")} placeholder="Search..." clearable />
      </div>
      <div className="mt-6">
        <Input label="Leave Reason" placeholder="Enter leave reason" value={form.reason} onChange={handleChange("reason")} maxLength={500} />
      </div>
      <div className="mt-6 flex justify-end">
        <button onClick={handleSubmit} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">Submit</button>
      </div>
    </div>
  );
};

export default InputShowcase;
