import { useState } from 'react';

// material-ui
import { Box, Typography } from '@mui/material';

// project-imports
import { Movie } from 'types/movie';
import MovieForm from './movie-form';
import AddConfirmForm from './add-confirm-form';

function getStepContent(
    step: number,
    handleNext: () => void,
    handleSetMovie: (movie: Movie & { file?: File | null, avatar?: string }) => void,
    movie: Movie & { file?: File | null, avatar?: string }
) {
    switch (step) {
        case 0:
            return (
                <MovieForm
                    handleNext={handleNext}
                    setMovie={handleSetMovie}
                    movie={movie}
                />
            );

        default:
            throw new Error('Unknown step');
    }
}

export default function AddMovie() {
    const [activeStep, setActiveStep] = useState(0);

    const initialValues: Movie = {
        id: 0,
        name: '',
        description: '',
        image: null,
        duration: 0,
        genre: '',
        endDate: '',
        status: '',
        trailerUrl: '',
        releaseDate: '',
        director: '',
        actor: '',
        showingStatus: ''
    };

    const [movie, setMovie] = useState<Movie>(initialValues);

    const setNext = () => {
        setActiveStep(activeStep + 1);
    };

    const setBack = () => {
        setActiveStep(activeStep - 1);
    };

    return (
        <Box>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Typography variant="h3">Thêm phim</Typography>
            </Box>

            {activeStep == 0 ? (
                <Box>
                    {getStepContent(
                        activeStep,
                        setNext,
                        setMovie,
                        movie
                    )}
                </Box>
            ) : (
                <AddConfirmForm handleBack={setBack} movie={movie} />
            )}
        </Box>
    );
}
