/* eslint-disable @typescript-eslint/no-unused-vars */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Order } from '../types';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://670b7631ac6860a6c2cc1860.mockapi.io/api/mm-rol/' }),  // Base URL for the API
  tagTypes: ['Order'],
  endpoints: (builder) => ({

    // 1. Fetch all orders
    getOrdersList: builder.query<Order[], void>({
      query: () => '/orders',
      providesTags: (result = [], error) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Order' as const, id })), 'Order']
          : ['Order'],
    }),

    // 2. Fetching a single order by ID
    getOrderById: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,  // Fetch an order by its ID
      providesTags: (result, error, id) => [{ type: 'Order', id }],  // Cache by order ID
    }),

    // 3. Creating a new order
    createOrder: builder.mutation<Order, Partial<Order>>({
      query: (newOrder) => ({
        url: '/orders',
        method: 'POST',
        body: newOrder,  // Send new order data in the request body
      }),
      invalidatesTags: ['Order'],  // Invalidate the cache to refresh the orders list

      // Optimistic Update
      onQueryStarted: async (newOrder, { dispatch, queryFulfilled }) => {
        try {
          const patchResult = dispatch(
            orderApi.util.updateQueryData('getOrdersList', undefined, (draftOrders) => {
              draftOrders.unshift(newOrder as Order);  // Add new order to the start
            })
          );

          // Wait for the mutation to succeed
          await queryFulfilled;

        } catch {
          // Rollback if the mutation fails
          // @ts-expect-error cun
          patchResult.undo();
        }
      }
    }),

    // 4. Updating an order
    updateOrder: builder.mutation<Order, { id: string; updates: Partial<Order> }>({
      query: ({ id, updates }) => ({
        url: `/orders/${id}`,
        method: 'PUT',
        body: updates,  // Send updated order data in request body
      }),
      invalidatesTags: ['Order'],  // Invalidate the cache to refresh the orders list
    }),

    // 5. Deleting an order
    deleteOrder: builder.mutation<void, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'DELETE',  // Send DELETE request to remove the order
      }),
      invalidatesTags: ['Order'],  // Invalidate cache after deletion
    }),
  }),
});

export const {
  useGetOrdersListQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi;
