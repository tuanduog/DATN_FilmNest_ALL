import { useState } from 'react';

// material-ui
import { Box, Typography } from '@mui/material';

// project-imports
import { User } from 'types/user';
import UserForm from './user-form';
import AddConfirmForm from './add-confirm-form';

function getStepContent(
    step: number,
    handleNext: () => void,
    setUser: (user: User & { file?: File | null }) => void,
    user: User & { file?: File | null }
) {
    switch (step) {
        case 0:
            return (
                <UserForm
                    handleNext={handleNext}
                    setUser={setUser}
                    user={user}
                />
            );

        default:
            throw new Error('Unknown step');
    }
}

// ==============================|| ADD COMBO ||============================== //

export default function AddUser() {
    const [activeStep, setActiveStep] = useState(0);

    // Extend Combo to hold file for upload locally
    const initialValues: User = {
        id: 0,
        username: '',
        email: '',
        fullname: '',
        phone: '',
        gender: '',
        dob: '',
        nationality: '',
        role: ''
    };

    const [user, setUser] = useState<User>(initialValues);

    const setNext = () => {
        setActiveStep(activeStep + 1);
    };

    const setBack = () => {
        setActiveStep(activeStep - 1);
    };

    return (
        <Box>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Typography variant="h3">Thêm người dùng</Typography>
            </Box>

            {activeStep == 0 ? (
                <Box>
                    {getStepContent(
                        activeStep,
                        setNext,
                        setUser,
                        user
                    )}
                </Box>
            ) : (
                <AddConfirmForm handleBack={setBack} user={user} />
            )}
        </Box>
    );
}
