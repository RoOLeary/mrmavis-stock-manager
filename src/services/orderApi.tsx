import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Order } from '../types';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://670b7631ac6860a6c2cc1860.mockapi.io/api/mm-rol/' }),  // Base URL for the API
  tagTypes: ['Order'],
  endpoints: (builder) => ({

    // 1. Fetch all orders
   /* eslint-disable @typescript-eslint/no-unused-vars */
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
      invalidatesTags: [{ type: 'Order', id: 'LIST' }],  // Ensure correct cache invalidation for the orders list
    
      // Optimistic Update
      onQueryStarted: async (newOrder, { dispatch, queryFulfilled }) => {
        // Perform an optimistic update
        const patchResult = dispatch(
          orderApi.util.updateQueryData('getOrdersList', undefined, (draftOrders) => {
            // Add the new order to the start of the orders array
            draftOrders.unshift({ ...newOrder, id: 'temp-id' } as Order);  // Provide a temporary id
          })
        );
    
        try {
          // Wait for the mutation to complete
          const { data: createdOrder } = await queryFulfilled;
    
          // Replace the temporary order with the actual order from the response
          dispatch(
            orderApi.util.updateQueryData('getOrdersList', undefined, (draftOrders) => {
              const index = draftOrders.findIndex(order => order.id === 'temp-id');
              if (index !== -1) {
                draftOrders[index] = createdOrder;  // Replace with the actual order
              }
            })
          );
        } catch (error) {
          // Rollback the optimistic update if the mutation fails
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
