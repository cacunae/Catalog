package com.catalogo.backend.controller;

import com.catalogo.backend.dto.ProductListResponse;
import com.catalogo.backend.exception.ResourceNotFoundException;
import com.catalogo.backend.model.Product;
import com.catalogo.backend.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;
import java.math.BigDecimal;

@Validated
@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ProductListResponse getProducts(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "brand", required = false) String brand,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "minPrice", required = false) BigDecimal minPrice,
            @RequestParam(value = "maxPrice", required = false) BigDecimal maxPrice,
            @RequestParam(value = "sortBy", required = false, defaultValue = "name")
            @Pattern(
                    regexp = "(?i)name|price|oldPrice|stock|brand|category|id",
                    message = "sortBy debe ser uno de: name, price, oldPrice, stock, brand, category, id"
            ) String sortBy,
            @RequestParam(value = "sortDir", required = false, defaultValue = "asc")
            @Pattern(regexp = "(?i)asc|desc", message = "sortDir debe ser asc o desc") String sortDir,
            @RequestParam(value = "page", required = false, defaultValue = "0")
            @Min(value = 0, message = "page debe ser mayor o igual a 0") Integer page,
            @RequestParam(value = "size", required = false, defaultValue = "10")
            @Min(value = 1, message = "size debe ser mayor a 0")
            @Max(value = 100, message = "size no puede ser mayor a 100") Integer size
    ) {
        if (minPrice != null && maxPrice != null && minPrice.compareTo(maxPrice) > 0) {
            throw new IllegalArgumentException("minPrice no puede ser mayor que maxPrice");
        }
        return productService.searchProducts(search, brand, category, minPrice, maxPrice, sortBy, sortDir, page, size);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable("id") String id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado para id: " + id));
    }
}
