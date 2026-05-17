import { useState, useEffect } from 'react';
import { useParams } from 'react-router';

// material-ui
import { Box, Typography, Stepper, Step, StepLabel, CircularProgress } from '@mui/material';

// project-imports
import RoomForm from './room-form';
import RoomSeatConfig from './seat';
import RoomConfirmForm from './add-confirm-form';
import { Room } from 'types/room';
import { getById } from 'api/room';
import { HttpStatusCode } from 'axios';
import { FormattedMessage } from 'react-intl';

const stepKeys = ['room-info', 'seat-config', 'confirm'];

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
                    isEdit
                />
            );
        default:
            throw new Error('Unknown step');
    }
}

// ==============================|| EDIT ROOM ||============================== //

export default function EditRoom() {
    const { id } = useParams();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [room, setRoom] = useState<Room | null>(null);

    useEffect(() => {
        const fetchRoom = async () => {
            if (!id) return;
            try {
                const response = await getById(Number(id));
                if (response.status === HttpStatusCode.Ok) {
                    const data = response.data;
                    if (data.type) {
                        data.type = data.type.toUpperCase();
                    }
                    setRoom(data);
                }
            } catch (error) {
                console.error('Error fetching room:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRoom();
    }, [id]);

    const handleNext = () => {
        setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (!room) {
        return (
            <Box p={3}>
                <Typography color="error"><FormattedMessage id="room-not-found" /></Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Typography variant="h3"><FormattedMessage id="edit-room" /></Typography>
            </Box>

            <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                {stepKeys.map((key) => (
                    <Step key={key}>
                        <StepLabel><FormattedMessage id={key} /></StepLabel>
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
