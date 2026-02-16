package com.catalogo.backend.service;

import com.catalogo.backend.dto.ProductListResponse;
import com.catalogo.backend.model.Product;
import com.catalogo.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.Locale;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public ProductListResponse searchProducts(
            String search,
            String brand,
            String category,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String sortBy,
            String sortDir,
            Integer page,
            Integer size
    ) {
        String normalizedSearch = normalize(search);
        String normalizedBrand = normalize(brand);
        String normalizedCategory = normalize(category);
        String normalizedSortBy = normalize(sortBy);
        String normalizedSortDir = normalize(sortDir);

        int safePage = page == null || page < 0 ? 0 : page;
        int safeSize = size == null || size <= 0 ? 10 : Math.min(size, 100);

        List<Product> filtered = productRepository.findAll().stream()
                .filter(product -> matchesSearch(product, normalizedSearch))
                .filter(product -> matchesExactFilter(product.getBrand(), normalizedBrand))
                .filter(product -> matchesExactFilter(product.getCategory(), normalizedCategory))
                .filter(product -> matchesPriceRange(product, minPrice, maxPrice))
                .sorted(resolveComparator(normalizedSortBy, normalizedSortDir))
                .collect(Collectors.toList());

        long totalElements = filtered.size();
        int totalPages = totalElements == 0 ? 0 : (int) Math.ceil((double) totalElements / safeSize);

        int fromIndex = safePage * safeSize;
        int toIndex = Math.min(fromIndex + safeSize, filtered.size());
        List<Product> pagedItems = fromIndex >= filtered.size()
                ? java.util.Collections.<Product>emptyList()
                : filtered.subList(fromIndex, toIndex);

        ProductListResponse response = new ProductListResponse();
        response.setItems(pagedItems);
        response.setPage(safePage);
        response.setSize(safeSize);
        response.setTotalElements(totalElements);
        response.setTotalPages(totalPages);
        response.setHasPrevious(safePage > 0);
        response.setHasNext(totalPages > 0 && safePage < (totalPages - 1));
        return response;
    }

    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }

    private boolean matchesSearch(Product product, String normalizedSearch) {
        if (normalizedSearch == null) {
            return true;
        }
        String haystack = (safeLower(product.getName()) + " " + safeLower(product.getDescription())).trim();
        return haystack.contains(normalizedSearch);
    }

    private boolean matchesExactFilter(String value, String normalizedFilter) {
        if (normalizedFilter == null) {
            return true;
        }
        return normalizedFilter.equals(safeLower(value));
    }

    private boolean matchesPriceRange(Product product, BigDecimal minPrice, BigDecimal maxPrice) {
        if (product.getPrice() == null) {
            return false;
        }
        boolean minOk = minPrice == null || product.getPrice().compareTo(minPrice) >= 0;
        boolean maxOk = maxPrice == null || product.getPrice().compareTo(maxPrice) <= 0;
        return minOk && maxOk;
    }

    private Comparator<Product> resolveComparator(String sortBy, String sortDir) {
        Comparator<Product> comparator;

        if ("price".equals(sortBy)) {
            comparator = Comparator.comparing(Product::getPrice, Comparator.nullsLast(BigDecimal::compareTo));
        } else if ("oldprice".equals(sortBy)) {
            comparator = Comparator.comparing(Product::getOldPrice, Comparator.nullsLast(BigDecimal::compareTo));
        } else if ("stock".equals(sortBy)) {
            comparator = Comparator.comparing(Product::getStock, Comparator.nullsLast(Integer::compareTo));
        } else if ("brand".equals(sortBy)) {
            comparator = Comparator.comparing(product -> safeLower(product.getBrand()), Comparator.nullsLast(String::compareTo));
        } else if ("category".equals(sortBy)) {
            comparator = Comparator.comparing(product -> safeLower(product.getCategory()), Comparator.nullsLast(String::compareTo));
        } else if ("id".equals(sortBy)) {
            comparator = Comparator.comparing(product -> safeLower(product.getId()), Comparator.nullsLast(String::compareTo));
        } else {
            comparator = Comparator.comparing(product -> safeLower(product.getName()), Comparator.nullsLast(String::compareTo));
        }

        if ("desc".equals(sortDir)) {
            return comparator.reversed();
        }
        return comparator;
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        if (trimmed.isEmpty()) {
            return null;
        }
        return trimmed.toLowerCase(Locale.ROOT);
    }

    private String safeLower(String value) {
        return value == null ? "" : value.toLowerCase(Locale.ROOT);
    }
}
