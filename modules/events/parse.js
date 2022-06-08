function getEventsFromMaintenances(maintenances,provinceName, neighborhoodName) {
	let events = [];

	maintenances.forEach((maintenance) => {
		const province = maintenance.provinces.find(
			(province) => province.nombre === provinceName
		);

		if (province) {
			province.schedules.forEach((schedule) => {
				const result = schedule.neighborhoods.find((neighborhood) =>
					neighborhood.includes(neighborhoodName)
				);
				if (result) {
					events.push({
						summary: `🚫⚡🔌 Scheduled maintenance: ${neighborhoodName}`,
						location: `${result}, ${provinceName}, Republica Dominicana`,
						description: JSON.stringify(schedule),
						start: {
							dateTime: schedule.desde.toISOString(),
							timeZone: "America/La_Paz",
						},
						end: {
							dateTime: schedule.hasta.toISOString(),
							timeZone: "America/La_Paz",
						},
					});
				}
			});
		}
	});

	return events;
}

export { getEventsFromMaintenances };
