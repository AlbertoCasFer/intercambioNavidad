import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ParticipantForm from './components/ParticipantForm';
import AdminPanel from './components/AdminPanel';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<ParticipantForm />} />
				<Route path="/admin" element={<AdminPanel />} />
			</Routes>
		</Router>
	);
}

export default App;
