import { Box, Button, Divider, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { styledStaff } from './styled';

const BASIC_EARN = 1;

type Employee = { name: string; efficiency: number; price: number };
const EMPLOYEES: Employee[] = [
	{ name: '作業員', efficiency: 5, price: 50 },
	{ name: '初階工程師', efficiency: 10, price: 300 },
	{ name: '中階工程師', efficiency: 30, price: 700 },
	{ name: '高階工程師', efficiency: 60, price: 1200 },
	{ name: '主管', efficiency: 80, price: 2000 },
];

function App() {
	const [money, setMoney] = useState(0);
	const [earnPerSecond, setEarnPerSecond] = useState(BASIC_EARN);
	const [hiredEmployees, setHiredEmployees] = useState<Employee[]>([]);

	const manualEarn = (m: number) => setMoney((prev) => prev + m);

	const hireEmployee = (employee: Employee) => {
		setMoney((prev) => prev - employee.price);
		setHiredEmployees((prev) => prev.concat(employee));
	};

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
				hiredEmployees.reduce(
					(total, employee) => total + employee.efficiency,
					0
				)
		);
	}, [hiredEmployees]);

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
					{EMPLOYEES.map((employee) => (
						<styledStaff.StyledStaffItem key={employee.name}>
							<Box>{employee.name}</Box>
							<Box>效率：{employee.efficiency}</Box>
							<Box>價格：{employee.price}</Box>
							<Box>
								現有數量：
								{
									hiredEmployees.filter(
										(hiredEmployee) => hiredEmployee.name === employee.name
									).length
								}
							</Box>
							<styledStaff.StyledStaffPurchaseButton
								variant="outlined"
								disabled={money < employee.price}
								onClick={() => hireEmployee(employee)}
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
