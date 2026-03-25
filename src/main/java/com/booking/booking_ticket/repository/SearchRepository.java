package com.booking.booking_ticket.repository;

import com.booking.booking_ticket.dto.response.PageResponse;
import com.booking.booking_ticket.entity.Movie;
import com.booking.booking_ticket.repository.criteria.SearchCriteria;
import com.booking.booking_ticket.repository.criteria.SearchQueryConsumer;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Repository
@RequiredArgsConstructor
public class SearchRepository {

    private static final Logger log = LoggerFactory.getLogger(SearchRepository.class);

    @PersistenceContext
    private EntityManager entityManager;

    public PageResponse searchingProductWithMultipleColumns(int pageNo, int pageSize, String sortBy, String... search) {
        //Xu ly search:
        List<SearchCriteria> orderColumn = new ArrayList<>();
        List<Movie> result = new ArrayList<>();
        if (search != null) {

            for (String s : search) {
                log.info("searching by creteria query");
                Pattern pattern = Pattern.compile("(\\w+?)(:|<|>)(.*)");
                Matcher matcher = pattern.matcher(s);
                if (matcher.find()) {
                    //todo
                    orderColumn.add(new SearchCriteria(matcher.group(1), matcher.group(2), matcher.group(3)));
                }

            }
            result = getProducts(pageNo, pageSize, orderColumn, sortBy);
        }
        //Number of records

        return PageResponse.builder()
                .pageNo(pageNo)
                .pageSize(pageSize)
                .totalPages(0)
                .items(result)
                .build();
    }

    private List<Movie> getProducts(int pageNo, int pageSize, List<SearchCriteria> orderColumn, String sortBy) {
        //tao builder
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        //Xac dinh kieu du lieu tra ve
        CriteriaQuery<Movie> criteriaQuery = criteriaBuilder.createQuery(Movie.class).distinct(true);
        //tao doi tuong truy van
        Root<Movie> root = criteriaQuery.from(Movie.class);
        //xu ly dieu kien tim kiem

        //tao predicate
        Predicate predicate = criteriaBuilder.conjunction();

        //truyen quaConsumer de ket hop nhieu predicate
        SearchQueryConsumer queryConsumer = new SearchQueryConsumer(criteriaBuilder, predicate, root);

            orderColumn.forEach(queryConsumer);

            predicate = queryConsumer.getPredicate();

            criteriaQuery.where(predicate);

        //sort
        if (StringUtils.hasLength(sortBy)) {
            Pattern pattern = Pattern.compile("(\\w+?)(:)(asc|desc)");
            Matcher matcher = pattern.matcher(sortBy);

            if (matcher.find()) {
                String columnRequest = matcher.group(1);
                if (matcher.group(3).equalsIgnoreCase("asc"))
                    criteriaQuery.orderBy(criteriaBuilder.asc(root.get(columnRequest)));
                else
                    criteriaQuery.orderBy(criteriaBuilder.desc(root.get(columnRequest)));
            }

        }
        return entityManager.createQuery(criteriaQuery).setFirstResult(pageNo).setMaxResults(pageSize).getResultList();
    }
}
