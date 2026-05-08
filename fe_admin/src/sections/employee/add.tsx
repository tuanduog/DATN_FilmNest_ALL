import { useState } from 'react';

// material-ui
import { Box, Typography } from '@mui/material';

// project-imports
import { Employee } from 'types/employee';
import EmployeeForm from './employee-form';
import AddConfirmForm from './add-confirm-form';

function getStepContent(
    step: number,
    handleNext: () => void,
    setEmployee: (employee: Employee) => void,
    employee: Employee
) {
    switch (step) {
        case 0:
            return (
                <EmployeeForm
                    handleNext={handleNext}
                    setEmployee={setEmployee}
                    employee={employee}
                />
            );

        default:
            throw new Error('Unknown step');
    }
}

// ==============================|| ADD EMPLOYEE ||============================== //

export default function AddEmployee() {
    const [activeStep, setActiveStep] = useState(0);

    const initialValues: Employee = {
        code: '',
        salary: 0,
        hireAt: '',
        username: '',
        email: '',
        phone: '',
        gender: '',
        dob: '',
        nationality: '',
        fullname: '',
        role: '',

        userId: null,
        theaterId: null,
        managerId: null,
    };

    const [employee, setEmployee] = useState<Employee>(initialValues);

    const setNext = () => {
        setActiveStep(activeStep + 1);
    };

    const setBack = () => {
        setActiveStep(activeStep - 1);
    };

    return (
        <Box>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Typography variant="h3">Thêm nhân viên</Typography>
            </Box>

            {activeStep == 0 ? (
                <Box>
                    {getStepContent(
                        activeStep,
                        setNext,
                        setEmployee,
                        employee
                    )}
                </Box>
            ) : (
                <AddConfirmForm handleBack={setBack} employee={employee} />
            )}
        </Box>
    );
}
