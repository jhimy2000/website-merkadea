import { Component, Input } from '@angular/core';
import {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from '../../models/product.model';
import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  //lista del carrito
  myShoppingCart: Product[] = [];
  total = 0;
  @Input() products: Product[] = [];
  showProductDetail = false;
  productChosen: Product = {
    id: '',
    price: 0,
    images: [],
    title: '',
    category: {
      id: '',
      name: '',
      typeImg: '',
    },
    description: '',
  };
  limit = 10;
  offset = 0;
  today = new Date();
  data = new Date(2021, 1, 21);

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = storeService.getShoppingCart();
  }

  // ngOnInit(): void {
  //   this.productsService.getProductsByPage(10, 0).subscribe((data) => {
  //     this.products = data;
  //   });
  // }
  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    // this.myShoppingCart.push(product);
    //metodos dentro de los arrays
    this.total = this.storeService.getTotal();
    // this.total = this.myShoppingCart.reduce((sum, item) => sum + item.price, 0);
  }
  toggleProductDetail() {
    this.showProductDetail = !this.showProductDetail;
  }
  onShowDetail(id: string) {
    this.productsService.getProduct(id).subscribe((data) => {
      // console.log('product', data);
      this.toggleProductDetail();
      this.productChosen = data;
    });
  }
  //crear un nuevoo producto usando la API
  createNewProduct() {
    const product: CreateProductDTO = {
      title: 'Nuevo producto',
      description: 'bla bla bla',
      images: ['https://placeimg.com/640/480/any?random=${Math.random()}'],
      price: 1000,
      categoryId: 2,
    };
    this.productsService.create(product).subscribe((data) => {
      this.products.unshift(data);
    });
  }
  updateProduct() {
    //buenas practicas
    const changes: UpdateProductDTO = {
      title: 'Nuevo titu',
    };
    const id = this.productChosen.id;
    this.productsService.update(id, changes).subscribe((data) => {
      //chapa en que posi esta tal product
      const productIndex = this.products.findIndex(
        (item) => item.id === this.productChosen.id
      );
      this.products[productIndex] = data;
    });
  }
  deleteProduct() {
    const id = this.productChosen.id;
    this.productsService.delete(id).subscribe(() => {
      const productIndex = this.products.findIndex(
        (item) => item.id === this.productChosen.id
      );
      this.products.splice(productIndex, 1);
      this.showProductDetail = false;
    });
  }

  loadMore() {
    this.productsService
      .getProductsByPage(this.limit, this.offset)
      .subscribe((data) => {
        this.products = this.products.concat(data);
        this.offset += this.limit;
      });
  }
}
