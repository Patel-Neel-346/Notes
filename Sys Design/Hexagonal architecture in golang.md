```txt
.  
├── app.env  
├── cmd  
│ └── rest  
│ └── main.go  
├── db  
│ └── migration  
│ ├── 000001_init_schema.down.sql  
│ └── 000001_init_schema.up.sql  
├── docker-compose.yml  
├── Dockerfile  
├── go.mod  
├── go.sum  
├── initiator  
│ └── initiator.go  
├── internal  
│ ├── constant  
│ │ ├── model  
│ │ │ ├── common.go  
│ │ │ ├── errors.go  
│ │ │ ├── request.go  
│ │ │ └── response.go  
│ │ ├── query  
│ │ │ ├── polls_vote_query.sql  
│ │ │ └── presentation_query.sql  
│ │ └── state  
│ ├── glue  
│ │ └── routing  
│ │ ├── poll_routing.go  
│ │ ├── presentation_routing.go  
│ │ └── vote_routing.go  
│ ├── handler  
│ │ ├── poll  
│ │ │ ├── http  
│ │ │ │ └── v1  
│ │ │ │ └── poll_handler.go  
│ │ │ └── rpc  
│ │ ├── presentation  
│ │ │ ├── http  
│ │ │ │ └── v1  
│ │ │ │ └── presentation_handler.go  
│ │ │ └── rpc  
│ │ └── vote  
│ │ ├── http  
│ │ │ └── v1  
│ │ │ └── vote_handler.go  
│ │ └── rpc  
│ ├── module  
│ │ ├── poll  
│ │ │ └── poll_usecase.go  
│ │ ├── presentation  
│ │ │ └── presentation_usecase.go  
│ │ └── vote  
│ │ └── vote_usecase.go  
│ ├── repository  
│ └── storage  
│ ├── cache  
│ └── persistence  
│ ├── db.go  
│ ├── main_test.go  
│ ├── models.go  
│ ├── polls_vote_query.sql.go  
│ ├── polls_vote_test.go  
│ ├── presentation_query.sql.go  
│ ├── presentation_test.go  
│ ├── querier.go  
│ ├── store.go  
│ ├── store_models.go  
│ ├── tx_presentation.go  
│ ├── tx_presentation_test.go  
│ ├── tx_vote.go  
│ └── tx_vote_test.go  
├── LICENSE  
├── Makefile  
├── pkg  
│ ├── config  
│ │ └── config.go  
│ ├── middleware  
│ │ └── gin_middlewares.go  
│ └── random  
│ └── random.go  
├── platform  
│ ├── logger  
│ │ └── logrus.go  
│ └── routers  
│ └── routers.go  
├── README.md  
├── sqlc.yaml  
├── start.sh  
└── wait-for.sh
```

```txt
domain/
    ┣━━ model/
    ┃    ┣━━ entity/
    ┃    ┃    ┣━━ customer.go
    ┃    ┃    ┣━━ product.go
    ┃    ┃    ┗━━ order.go
    ┃    ┗━━ valueobject/
    ┃         ┣━━ address.go
    ┃         ┣━━ payment.go
    ┃         ┗━━ status.go
    ┣━━ repository/          # Interfaces
    ┃    ┣━━ customer_repo.go
    ┃    ┣━━ product_repo.go
    ┃    ┗━━ order_repo.go
    ┗━━ service/
         ┣━━ customer_service.go
         ┣━━ product_service.go
         ┗━━ order_service.go

application/                 # Use Cases/Workflows
    ┣━━ command/
    ┣━━ query/
    ┗━━ event/

infrastructure/
    ┣━━ persistence/         # Repository Implementations
    ┃    ┣━━ mysql/
    ┃    ┃    ┣━━ customer_repository.go
    ┃    ┃    ┗━━ order_repository.go
    ┃    ┗━━ redis/
    ┃         ┣━━ cache_repository.go
    ┃         ┗━━ rate_limit_repository.go
    ┣━━ transport/
    ┃    ┣━━ http/
    ┃    ┃    ┣━━ customer_handler.go
    ┃    ┃    ┣━━ product_handler.go
    ┃    ┃    ┗━━ order_handler.go
    ┃    ┣━━ grpc/
    ┃    ┣━━ websocket/
    ┃    ┗━━ sms/
    ┃         ┣━━ twilio_adapter.go
    ┃         ┗━━ sms_service.go
    ┣━━ messaging/
    ┃    ┣━━ kafka/
    ┃    ┣━━ rabbitmq/
    ┃    ┗━━ event_handler.go
    ┗━━ util/
         ┣━━ logging/
         ┣━━ error_util.go
         ┗━━ http_util.go

config/                      # Configuration
    ┣━━ app_config.go
    ┗━━ db_config.go
```

```txt
application/
    ┣━━ command/              # Write operations (CQRS)
    ┃    ┣━━ post/
    ┃    ┃    ┣━━ create_post.go
    ┃    ┃    ┣━━ update_post.go
    ┃    ┃    ┗━━ delete_post.go
    ┃    ┣━━ user/
    ┃    ┃    ┣━━ register_user.go
    ┃    ┃    ┣━━ update_profile.go
    ┃    ┃    ┗━━ follow_user.go
    ┃    ┣━━ comment/
    ┃    ┃    ┣━━ add_comment.go
    ┃    ┃    ┗━━ delete_comment.go
    ┃    ┗━━ reaction/
    ┃         ┣━━ add_reaction.go
    ┃         ┗━━ remove_reaction.go
    ┣━━ query/               # Read operations (CQRS)
    ┃    ┣━━ post/
    ┃    ┃    ┣━━ get_post.go
    ┃    ┃    ┣━━ list_feed.go
    ┃    ┃    ┗━━ search_posts.go
    ┃    ┣━━ user/
    ┃    ┃    ┣━━ get_profile.go
    ┃    ┃    ┣━━ list_followers.go
    ┃    ┃    ┗━━ list_following.go
    ┃    ┗━━ analytics/
    ┃         ┣━━ post_insights.go
    ┃         ┗━━ user_engagement.go
    ┗━━ event/               # Event handlers
         ┣━━ post/
         ┃    ┣━━ post_created.go
         ┃    ┣━━ post_updated.go
         ┃    ┗━━ post_deleted.go
         ┣━━ user/
         ┃    ┣━━ user_registered.go
         ┃    ┣━━ profile_updated.go
         ┃    ┗━━ user_followed.go
         ┗━━ notification/
              ┣━━ send_notification.go
              ┗━━ mark_read.go
```
