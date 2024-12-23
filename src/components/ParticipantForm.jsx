import React, { useState } from 'react';

const ParticipantForm = () => {
	const [name, setName] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(`Nombre ingresado: ${name}`);
		// Aquí agregarás la lógica para conectarte a Firestore
		setName(''); // Limpia el input
	};

	return (
		<div>
			<h1>Participa en el Intercambio Secreto</h1>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Ingresa tu nombre"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<button type="submit">Enviar</button>
			</form>
		</div>
	);
};

export default ParticipantForm;
