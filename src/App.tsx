import { Box, Button, Divider, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { styledStaff } from './styled';

const BASIC_EARN = 1;
const LOCAL_STORAGE_KEYS = {
	money: 'money',
	hiredEmployeeIndexes: 'hiredEmployeeIndexes',
};

type Employee = { name: string; efficiency: number; price: number };
// 數據截自 Clicker Heroes https://clickerheroes.fandom.com/wiki/Heroes
const EMPLOYEES: Employee[] = [
	{ efficiency: 5, price: 50 },
	{ efficiency: 22, price: 250 },
	{ efficiency: 74, price: 1000 },
	{ efficiency: 245, price: 4000 },
	{ efficiency: 976, price: 20000 },
	{ efficiency: 3725, price: 100000 },
	{ efficiency: 10859, price: 400000 },
	{ efficiency: 47143, price: 2500000 },
].map((item, i) => ({ ...item, name: `Employee ${i + 1}` }));

function App() {
	const [money, setMoney] = useState(0);
	const [earnPerSecond, setEarnPerSecond] = useState(BASIC_EARN);
	const [hiredEmployeeIndexes, setHiredEmployeeIndexes] = useState<number[]>(
		[]
	);

	const manualEarn = (m: number) => setMoney((prev) => prev + m);

	const hireEmployee = (employeeIndex: number) => {
		const employee = EMPLOYEES[employeeIndex];
		setMoney((prev) => prev - employee.price);
		setHiredEmployeeIndexes((prev) => prev.concat(employeeIndex));
	};

	useEffect(() => {
		const storedMoney = localStorage.getItem(LOCAL_STORAGE_KEYS.money);
		const storedHiredEmployeeIndexes = localStorage.getItem(
			LOCAL_STORAGE_KEYS.hiredEmployeeIndexes
		);
		if (storedMoney) {
			setMoney(Number(storedMoney));
		}
		if (storedHiredEmployeeIndexes) {
			setHiredEmployeeIndexes(
				storedHiredEmployeeIndexes.split(',').map(Number)
			);
		}
	}, []);

	useEffect(() => {
		const earn = setInterval(() => {
			setMoney((prev) => prev + earnPerSecond);
		}, 1000);

		return () => {
			clearInterval(earn);
		};
	}, [earnPerSecond]);

	useEffect(() => {
		setEarnPerSecond(
			BASIC_EARN +
				hiredEmployeeIndexes.reduce((total, employeeIndex) => {
					const employee = EMPLOYEES[employeeIndex];
					return total + employee.efficiency;
				}, 0)
		);
	}, [hiredEmployeeIndexes]);

	useEffect(() => {
		localStorage.setItem(LOCAL_STORAGE_KEYS.money, String(money));
	}, [money]);

	useEffect(() => {
		localStorage.setItem(
			LOCAL_STORAGE_KEYS.hiredEmployeeIndexes,
			String(hiredEmployeeIndexes)
		);
	}, [hiredEmployeeIndexes]);

	return (
		<Box>
			<Box>
				<Typography variant="h6">
					每秒賺 {earnPerSecond} 元，目前有 {money} 元
				</Typography>
				<Button variant="outlined" onClick={() => manualEarn(1)}>
					手動賺錢
				</Button>
			</Box>
			<Divider sx={{ my: '10px' }} />
			<Box>
				<Typography variant="h6">雇用勞工</Typography>
				<styledStaff.StyledStaffList>
					{EMPLOYEES.map((employee, employeeIndex) => (
						<styledStaff.StyledStaffItem key={employee.name}>
							<Box>{employee.name}</Box>
							<Box>效率：{employee.efficiency}</Box>
							<Box>價格：{employee.price}</Box>
							<Box>
								現有數量：
								{
									hiredEmployeeIndexes.filter(
										(hiredEmployeeIndex) => hiredEmployeeIndex === employeeIndex
									).length
								}
							</Box>
							<styledStaff.StyledStaffPurchaseButton
								variant="outlined"
								disabled={money < employee.price}
								onClick={() => hireEmployee(employeeIndex)}
							>
								雇用
							</styledStaff.StyledStaffPurchaseButton>
						</styledStaff.StyledStaffItem>
					))}
				</styledStaff.StyledStaffList>
			</Box>
		</Box>
	);
}

export default App;
