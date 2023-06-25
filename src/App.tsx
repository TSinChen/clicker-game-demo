import {
	Alert,
	Box,
	Button,
	Divider,
	Snackbar,
	Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { styledStaff } from './styled';
import dayjs from 'dayjs';
import {
	BASIC_EARN,
	EMPLOYEES,
	LOCAL_STORAGE_KEYS,
	OFFLINE_EARN_PERCENTAGE,
} from './utils/constants';
import {
	hireEmployeeNumberPerTimeByKey,
	stringToNumbers,
} from './utils/functions';

function App() {
	const [money, setMoney] = useState(0);
	const [earnPerSecond, setEarnPerSecond] = useState(BASIC_EARN);
	const [hiredEmployeeIndexes, setHiredEmployeeIndexes] = useState<number[]>(
		[]
	);
	const [offlineEarnedMoney, setOfflineEarnedMoney] = useState(0);
	const [hireEmployeeNumberPerTime, setHireEmployeeNumberPerTime] = useState(1);

	const manualEarn = (earnedMoney: number) =>
		setMoney((prev) => prev + earnedMoney);

	const hireEmployee = (employeeIndex: number) => {
		const employee = EMPLOYEES[employeeIndex];
		setMoney((prev) => prev - employee.price * hireEmployeeNumberPerTime);
		setHiredEmployeeIndexes((prev) =>
			prev.concat(
				Array.from({ length: hireEmployeeNumberPerTime }, () => employeeIndex)
			)
		);
	};

	const closeOfflineEarnedMoneySnackbar = () => setOfflineEarnedMoney(0);

	const getEarnedMoneyPerSecondByIndexes = (indexes: number[]) =>
		indexes.reduce((total, index) => {
			const employee = EMPLOYEES[index];
			return total + employee.efficiency;
		}, 0);

	useEffect(() => {
		const storedLastPlayedTime = localStorage.getItem(
			LOCAL_STORAGE_KEYS.lastPlayedTime
		);
		const storedMoney = localStorage.getItem(LOCAL_STORAGE_KEYS.money);
		const storedHiredEmployeeIndexes = localStorage.getItem(
			LOCAL_STORAGE_KEYS.hiredEmployeeIndexes
		);
		if (storedMoney) {
			setMoney(Number(storedMoney));
		}
		if (storedHiredEmployeeIndexes) {
			setHiredEmployeeIndexes(stringToNumbers(storedHiredEmployeeIndexes));
		}
		if (storedMoney && storedHiredEmployeeIndexes) {
			if (storedLastPlayedTime) {
				const diff = dayjs().diff(dayjs(storedLastPlayedTime), 'second');
				if (diff > 10) {
					setOfflineEarnedMoney(
						Math.floor(
							diff *
								getEarnedMoneyPerSecondByIndexes(
									stringToNumbers(storedHiredEmployeeIndexes)
								) *
								OFFLINE_EARN_PERCENTAGE
						)
					);
				}
			}
		}
	}, []);

	useEffect(() => {
		const clickedKeys = new Set('');
		const keydown = (e: KeyboardEvent) => {
			switch (e.key) {
				case 'Control':
				case 'Shift':
					clickedKeys.add(e.key);
					break;
			}
			setHireEmployeeNumberPerTime(hireEmployeeNumberPerTimeByKey(clickedKeys));
		};
		const keyup = (e: KeyboardEvent) => {
			switch (e.key) {
				case 'Control':
				case 'Shift':
					clickedKeys.delete(e.key);
					break;
			}
			setHireEmployeeNumberPerTime(hireEmployeeNumberPerTimeByKey(clickedKeys));
		};
		window.addEventListener('keydown', keydown);
		window.addEventListener('keyup', keyup);
		return () => {
			window.removeEventListener('keydown', keydown);
			window.removeEventListener('keyup', keyup);
		};
	}, []);

	useEffect(() => {
		setMoney((prev) => prev + offlineEarnedMoney);
	}, [offlineEarnedMoney]);

	useEffect(() => {
		const earn = setInterval(() => {
			setMoney((prev) => prev + earnPerSecond);
			localStorage.setItem(
				LOCAL_STORAGE_KEYS.lastPlayedTime,
				dayjs().toISOString()
			);
		}, 1000);

		return () => {
			clearInterval(earn);
		};
	}, [earnPerSecond]);

	useEffect(() => {
		setEarnPerSecond(
			BASIC_EARN + getEarnedMoneyPerSecondByIndexes(hiredEmployeeIndexes)
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
					{EMPLOYEES.map((employee, employeeIndex) => {
						const quantity = hiredEmployeeIndexes.filter(
							(hiredEmployeeIndex) => hiredEmployeeIndex === employeeIndex
						).length;
						return (
							<styledStaff.StyledStaffItem key={employee.name}>
								<Box>{employee.name}</Box>
								<Box>效率：{employee.efficiency}</Box>
								<Box>價格：{employee.price}</Box>
								<Box>現有數量：{quantity}</Box>
								<Box>每秒賺 {employee.price * quantity} 元</Box>
								<styledStaff.StyledStaffPurchaseButton
									variant="outlined"
									disabled={money < employee.price * hireEmployeeNumberPerTime}
									onClick={() => hireEmployee(employeeIndex)}
								>
									雇用 {hireEmployeeNumberPerTime} 位
								</styledStaff.StyledStaffPurchaseButton>
							</styledStaff.StyledStaffItem>
						);
					})}
				</styledStaff.StyledStaffList>
			</Box>
			<Snackbar
				open={Boolean(offlineEarnedMoney)}
				autoHideDuration={3000}
				onClose={closeOfflineEarnedMoneySnackbar}
			>
				<Alert severity="info" onClose={closeOfflineEarnedMoneySnackbar}>
					離線時賺了 {offlineEarnedMoney} 元！
				</Alert>
			</Snackbar>
		</Box>
	);
}

export default App;
