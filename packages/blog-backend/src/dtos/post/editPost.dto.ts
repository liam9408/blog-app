import { IsString, IsNumber, IsOptional } from 'class-validator';

export class EditPostDto {
  @IsString()
  public title: string;

  @IsString()
  public description: string;

  @IsString()
  public content: string;

  @IsString()
  public cover: string;

  @IsString()
  public status: string;

  @IsNumber()
  @IsOptional()
  public categoryId: string;
}

export default EditPostDto;
