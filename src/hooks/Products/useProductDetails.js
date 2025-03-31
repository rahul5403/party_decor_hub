

const useProductDetails = (product_id) => {



    useEffect(() => {
        const fetchProduct = async () => {
          try {
            const response = await axios.get(
              `https://partydecorhub.com/api/products/${product_id}`
            );
            const productData = response.data;
    
            const updatedProduct = {
              ...productData,
              thumbnail: BASE_IMAGE_URL + productData.thumbnail,
              images: productData.images.map((img) => ({
                original: BASE_IMAGE_URL + img.image,
                thumbnail: BASE_IMAGE_URL + img.image,
              })),
            };
    
            setProduct(updatedProduct);
            setSelectedColor(updatedProduct.color || updatedProduct.available_colors?.[0] || "");
            setSelectedSize(updatedProduct.size || updatedProduct.available_sizes?.[0] || "");
    
            const allProductsResponse = await axios.get(
              "https://partydecorhub.com/api/products"
            );
            const filteredSimilarProducts = allProductsResponse.data
              .filter(
                (item) =>
                  item.category === updatedProduct.category &&
                  item.id !== updatedProduct.id
              )
              .map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                description: item.category,
                image: BASE_IMAGE_URL + item.thumbnail,
                images: [BASE_IMAGE_URL + item.thumbnail],
              }));
    
            setSimilarProducts(filteredSimilarProducts);
          } catch (error) {
            console.error("Error fetching product:", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchProduct();
      }, [product_id]);

      return {}
    

}