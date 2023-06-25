export const stringToNumbers = (string: string, separator = ',') =>
	string.split(separator).map(Number);

export const hireEmployeeNumberPerTimeByKey = (clickedKeys: Set<string>) => {
	if (clickedKeys.has('Control')) {
		return 100;
	} else if (clickedKeys.has('Shift')) {
		return 10;
	} else {
		return 1;
	}
};
