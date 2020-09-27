# shipwaves
Run the following commands to run the project
npm install express
npm install body-parser
npm install mongoose
npm install async

Ocean shipments are sent in big boxes called containers. One container can have one or more
shipments (one-to-many relationship). A container has limits of volume and weight it can carry. 
A shipment should have the following fields.
- (Unique) Shipment ID
- Weight (kg)
- Volume (cu cm)
- Container
A container should have the following fields.
- (Unique) Container ID
- Status (allowed values - ‘draft’, ‘transit’, ‘completed’ ; default - ‘draft’)
- Volume limit (cu cm) (default- 25000000)
- Weight limit (kg) (3000)
- Volume filled (cu cm)
- Weight filled (kg)
- Shipments
You have to create a web application that automatically assigns shipments to a container. When a
new shipment is created it should be automatically assigned to a container. If no existing container
can accommodate the shipment, a new container should be created and the shipment should be
assigned to the newly created container. If a shipment is deleted, there should be automatic
reshuffling of existing shipments to existing containers, minimising the number of containers used.
Please note that a shipment can only be assigned to a container with status equal to ‘draft’, and
shipments assigned to containers with status as ‘transit’ or ‘completed’ can not be deleted.
A user should be able to
- Create a new shipment
- View list of shipments (all fields listed above should be visible)
- Delete a shipment (from shipment list page)
- View list of containers (all fields listed above should be visible)
- Update the status of a container (from the container list page)
