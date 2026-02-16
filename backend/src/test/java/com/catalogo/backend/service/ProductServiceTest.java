package com.catalogo.backend.service;

import com.catalogo.backend.dto.ProductListResponse;
import com.catalogo.backend.model.Product;
import com.catalogo.backend.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    void shouldFilterBySearchBrandCategoryAndPriceRange() {
        when(productRepository.findAll()).thenReturn(sampleProducts());

        ProductListResponse response = productService.searchProducts(
                "wireless",
                "Sony",
                "Audio",
                new BigDecimal("100"),
                new BigDecimal("200"),
                "name",
                "asc",
                0,
                10
        );

        assertEquals(1, response.getItems().size());
        assertEquals("p1", response.getItems().get(0).getId());
        assertEquals(Long.valueOf(1), response.getTotalElements());
    }

    @Test
    void shouldSortByPriceDescending() {
        when(productRepository.findAll()).thenReturn(sampleProducts());

        ProductListResponse response = productService.searchProducts(
                null,
                null,
                null,
                null,
                null,
                "price",
                "desc",
                0,
                10
        );

        List<Product> items = response.getItems();
        assertEquals("p2", items.get(0).getId());
        assertEquals("p1", items.get(1).getId());
        assertEquals("p3", items.get(2).getId());
    }

    @Test
    void shouldPaginateAndReturnNavigationMetadata() {
        when(productRepository.findAll()).thenReturn(sampleProducts());

        ProductListResponse response = productService.searchProducts(
                null,
                null,
                null,
                null,
                null,
                "name",
                "asc",
                1,
                2
        );

        assertEquals(1, response.getPage().intValue());
        assertEquals(2, response.getSize().intValue());
        assertEquals(Long.valueOf(3), response.getTotalElements());
        assertEquals(2, response.getTotalPages().intValue());
        assertFalse(response.getHasNext());
        assertTrue(response.getHasPrevious());
        assertEquals(1, response.getItems().size());
    }

    private List<Product> sampleProducts() {
        Product p1 = buildProduct("p1", "Wireless Headphones", "Audio", "Sony", "150.00");
        Product p2 = buildProduct("p2", "4K TV", "TV", "LG", "900.00");
        Product p3 = buildProduct("p3", "Phone Charger", "Accessories", "Anker", "25.00");
        return Arrays.asList(p1, p2, p3);
    }

    private Product buildProduct(String id, String name, String category, String brand, String price) {
        Product product = new Product();
        product.setId(id);
        product.setName(name);
        product.setDescription(name + " description");
        product.setCategory(category);
        product.setBrand(brand);
        product.setPrice(new BigDecimal(price));
        product.setStock(10);
        return product;
    }
}
