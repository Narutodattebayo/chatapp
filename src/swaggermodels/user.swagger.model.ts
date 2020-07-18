import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "swagger-express-ts";



@ApiModel({
    description: "User Add",
    name: "ReqAddUser"
})

export class ReqAddUserModel {

    @ApiModelProperty({
        description: "name of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Anil' as any
    })
    name: string;
    @ApiModelProperty({
        description: "email of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'abc@yopmail.com' as any
    })
    email: string;
    @ApiModelProperty({
        description: "password",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '12345678' as any
    })
    password: string;
    @ApiModelProperty({
        description: "image url",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg' as any
    })
    image: string;
}


@ApiModel({
    description: "User Add",
    name: "ReqUserVerifyOtp"
})

export class ReqUserVerifyOtpModel {


    @ApiModelProperty({
        description: "email of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'abc@yopmail.com' as any
    })
    email: string;
    @ApiModelProperty({
        description: "otp",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '1234' as any
    })
    otp: string;

}


@ApiModel({
    description: "User Add",
    name: "ReqUserLogin"
})

export class ReqUserLoginModel {


    @ApiModelProperty({
        description: "email of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'abc@yopmail.com' as any
    })
    email: string;
    @ApiModelProperty({
        description: "password",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Password' as any
    })
    password: string;

}
