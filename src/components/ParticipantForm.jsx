import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import styles from './ParticipantForm.module.css';

const ParticipantForm = () => {
	const [participants, setParticipants] = useState([]);
	const [selectedName, setSelectedName] = useState('');
	const [message, setMessage] = useState('');

	useEffect(() => {
		const fetchParticipants = async () => {
			try {
				const docRef = doc(db, 'sorteo', 'vpICpnULFKykTffUMdyz');
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					const data = docSnap.data();
					setParticipants(data.participants || []);
				} else {
					console.error('No se encontró el documento.');
				}
			} catch (error) {
				console.error('Error al obtener participantes:', error);
			}
		};

		fetchParticipants();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!selectedName) {
			setMessage('Por favor, selecciona tu nombre.');
			return;
		}

		try {
			const docRef = doc(db, 'sorteo', 'vpICpnULFKykTffUMdyz');
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				const data = docSnap.data();
				const { participants = [], assigned = {} } = data;

				if (selectedName in assigned) {
					setMessage(
						`Ya participaste. A ti te toca ${assigned[selectedName]}.`,
					);
					return;
				}

				const available = participants.filter(
					(participant) =>
						participant !== selectedName &&
						!Object.values(assigned).includes(participant),
				);

				if (available.length === 0) {
					setMessage('No hay personas disponibles para asignarte.');
					return;
				}

				const randomIndex = Math.floor(Math.random() * available.length);
				const assignedName = available[randomIndex];

				assigned[selectedName] = assignedName;
				await updateDoc(docRef, { assigned });

				setMessage(`A ti te toca: ${assignedName}`);
			} else {
				setMessage('Error: No se encontró el documento del intercambio.');
			}
		} catch (error) {
			console.error('Error al asignar participante:', error);
			setMessage('Hubo un error. Inténtalo de nuevo.');
		}

		setSelectedName(''); // Limpia la selección
	};

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Feliz Navidad 2024</h1>
			<div className={styles.lights}>
				<div className={styles.light}></div>
				<div className={styles.light}></div>
				<div className={styles.light}></div>
				<div className={styles.light}></div>
				<div className={styles.light}></div>
				<div className={styles.light}></div>
				<div className={styles.light}></div>
			</div>
			<form onSubmit={handleSubmit}>
				<select
					value={selectedName}
					onChange={(e) => setSelectedName(e.target.value)}
				>
					<option value="">Selecciona tu nombre</option>
					{participants.map((participant, index) => (
						<option key={index} value={participant}>
							{participant}
						</option>
					))}
				</select>
				<button type="submit">Enviar</button>
			</form>
			{message && <p className={styles.message}>{message}</p>}
		</div>
	);
};

export default ParticipantForm;
