import { useState } from 'react';

// material-ui
import { Box, Typography } from '@mui/material';

// project-imports
import { Membership } from 'types/membership';
import MembershipForm from './membership-form';
import AddConfirmForm from './add-confirm-form';

function getStepContent(
    step: number,
    handleNext: () => void,
    handleSetMembership: (membership: Membership & { file?: File | null, avatar?: string }) => void,
    membership: Membership & { file?: File | null, avatar?: string }
) {
    switch (step) {
        case 0:
            return (
                <MembershipForm
                    handleNext={handleNext}
                    setMembership={handleSetMembership}
                    membership={membership}
                />
            );

        default:
            throw new Error('Unknown step');
    }
}

// ==============================|| ADD MEMBERSHIP ||============================== //

export default function AddMembership() {
    const [activeStep, setActiveStep] = useState(0);

    // Extend Membership to hold file for upload locally
    const initialValues: Membership = {
        id: 0,
        name: '',
        type: '',
        price: 0,
        duration: 0,
        status: '',
        image: null,
        benefits: []
    };

    const [membership, setMembership] = useState<Membership>(initialValues);

    const setNext = () => {
        setActiveStep(activeStep + 1);
    };

    const setBack = () => {
        setActiveStep(activeStep - 1);
    };

    return (
        <Box>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Typography variant="h3">Thêm gói thành viên</Typography>
            </Box>

            {activeStep == 0 ? (
                <Box>
                    {getStepContent(
                        activeStep,
                        setNext,
                        setMembership,
                        membership
                    )}
                </Box>
            ) : (
                <AddConfirmForm handleBack={setBack} membership={membership} />
            )}
        </Box>
    );
}
