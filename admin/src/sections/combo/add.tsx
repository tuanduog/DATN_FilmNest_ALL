import { useState } from 'react';

// material-ui
import { Box, Typography } from '@mui/material';

// project-imports
import { Combo } from 'types/combo';
import ComboForm from './combo-form';
import AddConfirmForm from './add-confirm-form';

function getStepContent(
    step: number,
    handleNext: () => void,
    handleSetCombo: (combo: Combo & { file?: File | null, avatar?: string }) => void,
    combo: Combo & { file?: File | null, avatar?: string }
) {
    switch (step) {
        case 0:
            return (
                <ComboForm
                    handleNext={handleNext}
                    setCombo={handleSetCombo}
                    combo={combo}
                />
            );

        default:
            throw new Error('Unknown step');
    }
}

// ==============================|| ADD COMBO ||============================== //

export default function AddCombo() {
    const [activeStep, setActiveStep] = useState(0);

    // Extend Combo to hold file for upload locally
    const initialValues: Combo = {
        id: 0,
        name: '',
        price: 0,
        description: '',
        status: '',
        image: null
    };

    const [combo, setCombo] = useState<Combo>(initialValues);

    const setNext = () => {
        setActiveStep(activeStep + 1);
    };

    const setBack = () => {
        setActiveStep(activeStep - 1);
    };

    return (
        <Box>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Typography variant="h3">Thêm combo ưu đãi</Typography>
            </Box>

            {activeStep == 0 ? (
                <Box>
                    {getStepContent(
                        activeStep,
                        setNext,
                        setCombo,
                        combo
                    )}
                </Box>
            ) : (
                <AddConfirmForm handleBack={setBack} combo={combo} />
            )}
        </Box>
    );
}
