let products = null;
        fetch('products.json')
            .then(response => response.json())
            .then(data => {
                products = data;
                console.log(products);
            })
