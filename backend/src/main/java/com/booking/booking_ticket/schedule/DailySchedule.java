package com.booking.booking_ticket.schedule;

import com.booking.booking_ticket.entity.Movie;
import com.booking.booking_ticket.repository.MovieRepository;
import com.booking.booking_ticket.utils.ShowingStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DailySchedule {

    @Autowired
    private MovieRepository movieRepository;

    @Scheduled(cron = "0 0 0 * * *")
    public void updateShowingStatus() {
        List<Movie> movies = movieRepository.findAll();
        for (Movie movie : movies) {
            if (movie.getShowingStatus().equals(ShowingStatus.STOP)) {
                continue;
            }

            if (movie.getShowingStatus().equals(ShowingStatus.NOW_SHOWING)) {
                LocalDate endDate = movie.getEndDate();
                if (endDate.isBefore(LocalDate.now())) {
                    movie.setShowingStatus(ShowingStatus.STOP);
                }
            } else {
                LocalDate releaseDate = movie.getReleaseDate();
                if (!releaseDate.isAfter(LocalDate.now())) {
                    movie.setShowingStatus(ShowingStatus.NOW_SHOWING);
                }
            }
        }

        movieRepository.saveAll(movies);
    }
}
