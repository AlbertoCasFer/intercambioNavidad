import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import styles from './ParticipantForm.module.css';

const ParticipantForm = () => {
	const [participants, setParticipants] = useState([]);
	const [selectedName, setSelectedName] = useState('');
	const [message, setMessage] = useState('');
	const images = [
		'/img/9E863AD0-B62E-4F09-B50B-85D025A933B2_1_105_c.jpeg',
		'/img/643CB88F-7560-403A-BD24-65D1D2757F07_1_105_c.jpeg',
		'/img/33199863-3214-449E-A2EE-CEC8F7202ACB_1_105_c.jpeg',
		'/img/08DB1A60-B267-4166-997F-C902A97949EA_1_105_c.jpeg',
	];

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

				// Verifica si ya está asignado
				if (selectedName in assigned) {
					setMessage(
						`Ya participaste. A ti te toca ${assigned[selectedName]}.`,
					);
					return;
				}

				// Generar asignaciones únicas si no existen
				if (Object.keys(assigned).length === 0) {
					const shuffled = [...participants].sort(() => Math.random() - 0.5);
					const newAssignments = {};

					for (let i = 0; i < shuffled.length; i++) {
						const giver = shuffled[i];
						const receiver = shuffled[(i + 1) % shuffled.length];
						newAssignments[giver] = receiver;
					}

					await updateDoc(docRef, { assigned: newAssignments });
					Object.assign(assigned, newAssignments); // Actualizar localmente
				}

				setMessage(`A ti te toca: ${assigned[selectedName]}`);
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

			{/* Formulario del intercambio */}
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

			{/* Sección de regalos */}
			<div className={styles.giftContainer}>
				{images.map((image, index) => (
					<div className={styles.giftBox} key={index}>
						<div className={styles.ribbon}></div>
						<img
							src={image}
							alt={`Regalo ${index + 1}`}
							className={styles.giftImage}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default ParticipantForm;
