/* eslint-disable @typescript-eslint/no-unused-vars */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { Product } from '../types';


export const productApi = createApi({
  reducerPath: 'productApi',

  baseQuery: fetchBaseQuery({ baseUrl: 'https://670b7631ac6860a6c2cc1860.mockapi.io/api/mm-rol/' }),  // The base URL of your
  tagTypes: ['Product'],
  endpoints: (builder) => ({

    // 1. Fetch all products

    getProductList: builder.query<Product[], void>({
      query: () => '/products',
      providesTags: (result = [], Error) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Product' as const, id })), 'Product']
          : ['Product'],
    }),


    // 2. Fetching a single product by ID

    getProductById: builder.query<Product, void>({
      query: (id) => `/products/${id}`,  // Fetch a product by its ID
      // @ts-expect-error fuc
      providesTags: (result, error, id) => [{ type: 'Product', id }],  // Cache by product ID
    }),

    // 3. Creating a new product

    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (newProduct) => ({
        url: '/products',
        method: 'POST',
        body: newProduct,  // Send new product data in request body
      }),
      invalidatesTags: ['Product'],  // Invalidate the cache to refresh the product list

      // Optimistic Update
      onQueryStarted: async (newProduct, { dispatch, queryFulfilled }) => {
        try {
          // Optimistically update the products cache by prepending the new product to the list
          // @ts-expect-error kkk
          const patchResult = dispatch(
            productApi.util.updateQueryData('getProductList', undefined, (draftProducts) => {
              draftProducts.unshift(newProduct as Product);  // Add new product to the start
            })
          );

          // Wait for the mutation to succeed
          await queryFulfilled;

        } catch {
          // Rollback if the mutation fails
           // @ts-expect-error off
          patchResult.undo();
        }
      }
    }),



    updateProduct: builder.mutation<Product, { id: string; updates: Partial<Product> }>({
      query: ({ id, updates }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: updates,  // Send new product data in request body
      }),
      invalidatesTags: ['Product'],  // Invalidate the cache to refresh the product list
    }),

    // 4. Updating product stock

    updateProductStock: builder.mutation<void, { id: string; stock: number }>({
      query: ({ id, stock }) => ({
        url: `/products/${id}/stock`,
        method: 'PUT',
        body: { stock },  // Send new stock level
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }],  // Invalidate the cache for the specific product
    }),

    // 5. Toggling product availability

    toggleProductAvailability: builder.mutation<void, { id: string; isAvailable: boolean }>({
      query: ({ id, isAvailable }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: { isAvailable },  // Send new availability state
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }],  // Invalidate cache for the specific product
    }),

    // 6. Deleting a product
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',  // Send DELETE request to remove the product
      }),
      invalidatesTags: ['Product'],  // Invalidate cache after deletion
    }),
  }),
});


export const {
  useGetProductListQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUpdateProductStockMutation,
  useToggleProductAvailabilityMutation,
  useDeleteProductMutation,
} = productApi;