package com.catalogo.backend.repository;

import com.catalogo.backend.model.Product;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Repository
public class ProductRepository {

    private final ObjectMapper objectMapper;
    private List<Product> products = Collections.emptyList();

    public ProductRepository(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void init() {
        try (InputStream inputStream = new ClassPathResource("catalog.json").getInputStream()) {
            List<Product> loadedProducts = objectMapper.readValue(inputStream, new TypeReference<List<Product>>() {
            });
            if (loadedProducts == null) {
                loadedProducts = Collections.emptyList();
            }
            this.products = Collections.unmodifiableList(new ArrayList<Product>(loadedProducts));
        } catch (IOException ex) {
            throw new IllegalStateException("No se pudo cargar catalog.json desde classpath", ex);
        }
    }

    public List<Product> findAll() {
        return this.products;
    }

    public Optional<Product> findById(String id) {
        if (id == null) {
            return Optional.empty();
        }
        return this.products.stream()
                .filter(product -> id.equals(product.getId()))
                .findFirst();
    }
}
