import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const AdminPanel = () => {
	const [assignments, setAssignments] = useState({});
	const [message, setMessage] = useState('');

	useEffect(() => {
		const fetchAssignments = async () => {
			try {
				const docRef = doc(db, 'sorteo', 'vpICpnULFKykTffUMdyz');
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					const data = docSnap.data();
					setAssignments(data.assigned || {});
				} else {
					console.error('No se encontró el documento.');
				}
			} catch (error) {
				console.error('Error al obtener asignaciones:', error);
			}
		};

		fetchAssignments();
	}, []);

	const handleReset = async () => {
		try {
			const docRef = doc(db, 'sorteo', 'vpICpnULFKykTffUMdyz');
			await updateDoc(docRef, { assigned: {} });
			setAssignments({});
			setMessage('Las asignaciones han sido reiniciadas.');
		} catch (error) {
			console.error('Error al reiniciar asignaciones:', error);
			setMessage('Hubo un error al reiniciar las asignaciones.');
		}
	};

	return (
		<div>
			<h1>Panel de Administrador</h1>
			<button onClick={handleReset}>Reiniciar Asignaciones</button>
			{message && <p>{message}</p>}
			<h2>Asignaciones Actuales</h2>
			<table border="1">
				<thead>
					<tr>
						<th>Participante</th>
						<th>Intercambio</th>
					</tr>
				</thead>
				<tbody>
					{Object.entries(assignments).map(([participant, assigned], index) => (
						<tr key={index}>
							<td>{participant}</td>
							<td>{assigned}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default AdminPanel;
