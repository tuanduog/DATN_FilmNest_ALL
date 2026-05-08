import { useState } from 'react';

// material-ui
import { Box, Typography, Stepper, Step, StepLabel } from '@mui/material';

// project-imports
import RoomForm from './room-form';
import RoomSeatConfig from './seat';
import RoomConfirmForm from './add-confirm-form';

import { Room } from 'types/room';

const steps = ['Thông tin phòng chiếu', 'Thiết lập ghế', 'Xác nhận'];

function getStepContent(
    step: number,
    handleNext: () => void,
    handleBack: () => void,
    handleSetRoom: (room: Room) => void,
    room: Room
) {
    switch (step) {
        case 0:
            return (
                <RoomForm
                    handleNext={handleNext}
                    setRoom={handleSetRoom}
                    room={room}
                />
            );
        case 1:
            return (
                <RoomSeatConfig
                    handleNext={handleNext}
                    handleBack={handleBack}
                    setRoom={handleSetRoom}
                    room={room}
                />
            );
        case 2:
            return (
                <RoomConfirmForm
                    handleBack={handleBack}
                    room={room}
                />
            );

        default:
            throw new Error('Unknown step');
    }
}

// ==============================|| ADD ROOM ||============================== //

export default function AddRoom() {
    const [activeStep, setActiveStep] = useState(0);

    const initialValues: Room = {
        id: 0,
        name: '',
        capacity: 0,
        totalRow: 0,
        totalColumn: 0,
        type: '',
        status: 'ACTIVE',
        theaterId: null
    };

    const [room, setRoom] = useState<Room>(initialValues);

    const handleNext = () => {
        setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    return (
        <Box>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Typography variant="h3">Thêm phòng chiếu</Typography>
            </Box>

            <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box>
                {getStepContent(
                    activeStep,
                    handleNext,
                    handleBack,
                    setRoom,
                    room
                )}
            </Box>
        </Box>
    );
}

