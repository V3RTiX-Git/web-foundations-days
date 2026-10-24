# SnapShare: Scaling Plan

## 1. Assumptions

SnapShare is a photo-sharing app where users upload photos and scroll through a feed containing photos from people they follow.

The following assumptions are used for the estimates:

- SnapShare has 10 million registered users.
- 10% of registered users are active each day.
- Each daily active user uploads one photo per day.
- Each daily active user views 50 feed pages per day.
- Each original photo is 2 MB.
- Each photo has one thumbnail of 50 KB.
- A day has 86,400 seconds, and a year has 365 days.
- All daily active users are assumed to upload and view the stated amounts each day.
- Traffic estimates are averages across the full day; actual traffic will vary by time of day.
- Storage estimates use decimal units (1 TB = 1,000 GB) and exclude backups, replication, and other overhead.

### Daily active users

Daily active users = 10,000,000 × 10%

Daily active users = **1,000,000 users**

## 2. Traffic and Storage Estimates

### Photo uploads per second

Each active user uploads one photo per day.

Daily uploads = 1,000,000 × 1 = **1,000,000 uploads per day**

Average uploads per second = 1,000,000 ÷ 86,400

Average uploads per second ≈ **11.6 uploads per second**

### Feed views per second

Each active user views 50 feed pages per day.

Daily feed views = 1,000,000 × 50 = **50,000,000 feed views per day**

Average feed views per second = 50,000,000 ÷ 86,400

Average feed views per second ≈ **579 feed views per second**

Peak feed views per second = 579 × 5

Peak feed views per second ≈ **2,895 feed views per second**

The peak estimate uses the required 5× multiplier and is an estimate, not a guarantee of the highest possible traffic.

### Photo storage per year

There are 1,000,000 photo uploads per day.

Annual uploads = 1,000,000 × 365 = **365,000,000 photos per year**

Original photo storage per year:

365,000,000 × 2 MB = 730,000,000 MB

Original photo storage ≈ **730 TB per year**

Thumbnail storage per year:

365,000,000 × 50 KB = 18,250,000,000 KB

Thumbnail storage ≈ **18.25 TB per year**

Total new photo storage per year:

730 TB + 18.25 TB = **748.25 TB per year**

This is the storage needed for one year of new originals and thumbnails. If old photos are kept, total storage will continue to grow each year.

## 3. Read-Heavy or Write-Heavy?

SnapShare is expected to be **read-heavy**. Each active user uploads one photo but views 50 feed pages per day. This produces approximately 50 million feed views compared with 1 million uploads per day.

The architecture should therefore make reading feeds and serving photos efficient. Caching frequently requested feed data, using a database read replica for read queries, and serving images through a CDN can reduce the load on the application servers and main database. Uploads still need to be reliable, but the design should prioritise the much higher volume of reads.

## 4. Where Photos Should Be Stored

Photo files should be stored in object storage rather than directly inside the database. Photos are large files, and storing them in the database would increase its storage requirements and make database backups and queries more expensive to manage.

The database should store photo metadata, such as the photo ID, owner, caption, upload time and object-storage location. The original photo and its thumbnail should be stored as objects, while the CDN can deliver those images to users efficiently.

## 5. Proposed Architecture

```text
                       +------------------+
                       |   Mobile / Web   |
                       |      Clients     |
                       +--------+---------+
                                |
                    +-----------+-----------+
                    |                       |
                    v                       v
             +-------------+         +-------------+
             |     CDN     |         |    Load     |
             | Cached      |         |  Balancer   |
             | Photos      |         +------+------+
             +------+------+                |
                    |                       v
                    |                +-------------+
                    |                | Application |
                    |                |   Servers   |
                    |                +------+------+
                    |                       |
                    |          +------------+------------+
                    |          |            |            |
                    |          v            v            v
                    |     +---------+  +----------+  +----------+
                    |     |  Cache  |  | Database |  |  Object  |
                    |     | Feed    |  | Primary  |  | Storage  |
                    |     | Data    |  +----+-----+  | Originals|
                    |     +---------+       |        | Thumbnails|
                    |                        v        +-----+----+
                    |                 +-------------+       ^
                    |                 | Database    |       |
                    |                 | Read Replica|       |
                    |                 +-------------+       |
                    |                                       |
                    |                +---------------+      |
                    |                |     Queue     |      |
                    |                | Thumbnail Job |      |
                    |                +-------+-------+      |
                    |                        |              |
                    |                        v              |
                    |                +---------------+      |
                    |                | Thumbnail     |------+
                    |                | Worker        |
                    |                +---------------+
                    |
                    +------ Images delivered to clients
```

## 6. What Each Component Does

- **Mobile/Web Clients:** Allow users to upload photos, follow other users and browse the feed.
- **CDN:** Delivers cached photos and thumbnails from locations closer to users, reducing image-loading time and requests reaching the main application.
- **Load Balancer:** Distributes incoming application requests across available application servers so that one server does not handle all the traffic.
- **Application Servers:** Handle application logic, authentication, feed requests, upload coordination and database interactions.
- **Cache:** Keeps frequently requested feed data in fast storage so the application does not need to query the database for every feed request.
- **Database Primary:** Stores authoritative application data, including users, follows, photo metadata and upload records.
- **Database Read Replica:** Provides a copy of database data for read queries, reducing the number of reads handled by the primary database.
- **Object Storage:** Stores the original photo files and generated thumbnails separately from the database.
- **Queue:** Holds thumbnail-generation jobs so they can be processed asynchronously instead of making the upload request wait for thumbnail creation.
- **Thumbnail Worker:** Processes queued jobs, creates smaller versions of uploaded photos and saves the thumbnails to object storage.

## 7. Step-by-Step Photo Upload Flow

1. A user selects a photo and uploads it through the mobile or web application.
2. The load balancer directs the upload request to an available application server.
3. The application server checks that the request is valid and that the user is allowed to upload the photo.
4. The original photo is saved in object storage, and the application records its metadata and storage location in the primary database.
5. The application places a thumbnail-generation job on the queue.
6. The application confirms the upload to the user without waiting for the thumbnail to be generated.
7. A thumbnail worker takes a job from the queue and retrieves the original photo from object storage.
8. The worker creates a 50 KB thumbnail, saves it in object storage and makes its location available to the application.
9. When users view the photo in a feed, the application retrieves the required feed and photo metadata, using the cache and read replica where appropriate.
10. The CDN serves the original photo or thumbnail to users, reducing repeated requests to the application servers and object storage.

## 8. Trade-Offs

### Trade-off 1: Faster reads versus cache freshness

Caching feed data improves response times and reduces database load. However, cached information can become outdated when a user uploads a photo or follows someone new. The system must balance performance with how quickly changes appear in feeds.

### Trade-off 2: Faster uploads versus thumbnail availability

Using a queue allows the application to confirm an upload before the thumbnail is ready. This makes uploads faster and keeps image processing separate from normal requests. However, a thumbnail may not be immediately available, and the system needs to retry failed jobs or otherwise handle processing failures.

### Trade-off 3: Read replicas versus data consistency

A read replica reduces the load on the primary database and helps serve large numbers of feed requests. However, changes may take time to appear on the replica. A user might not immediately see newly updated information when a feed reads from the replica.

### Trade-off 4: Object storage and CDN versus cost and complexity

Object storage and a CDN are suitable for serving large numbers of photos efficiently. However, storing hundreds of terabytes of new data each year and delivering it to users creates ongoing storage and bandwidth costs. The architecture also requires management of caching, access permissions and photo locations.

## Conclusion

SnapShare should use a read-focused architecture that separates application data from photo files. Application servers handle user requests, a primary database and read replica manage structured data, a cache speeds up feed access, and object storage keeps original photos and thumbnails. A queue and thumbnail worker process images asynchronously, while a CDN helps deliver photos efficiently at scale.
