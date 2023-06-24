import { Box, Button, styled } from '@mui/material';

export const styledStaff = {
	StyledStaffList: styled(Box)(() => ({
		display: 'flex',
		maxWidth: '600px',
		flexDirection: 'column',
		rowGap: '20px',
	})),
	StyledStaffItem: styled(Box)(() => ({
		display: 'flex',
		alignItems: 'center',
		columnGap: '10px',
	})),
	StyledStaffPurchaseButton: styled(Button)(() => ({
		marginLeft: 'auto',
	})),
};
