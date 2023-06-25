type Employee = { name: string; efficiency: number; price: number };
// 數據截自 Clicker Heroes https://clickerheroes.fandom.com/wiki/Heroes
export const EMPLOYEES: Employee[] = [
	{ efficiency: 5, price: 50 },
	{ efficiency: 22, price: 250 },
	{ efficiency: 74, price: 1000 },
	{ efficiency: 245, price: 4000 },
	{ efficiency: 976, price: 20000 },
	{ efficiency: 3725, price: 100000 },
	{ efficiency: 10859, price: 400000 },
	{ efficiency: 47143, price: 2500000 },
].map((item, i) => ({ ...item, name: `Employee ${i + 1}` }));

export const BASIC_EARN = 1;

export const LOCAL_STORAGE_KEYS = {
	money: 'money',
	hiredEmployeeIndexes: 'hiredEmployeeIndexes',
	lastPlayedTime: 'lastPlayedTime',
};

export const OFFLINE_EARN_PERCENTAGE = 0.1;
