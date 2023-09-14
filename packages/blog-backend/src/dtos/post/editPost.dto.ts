import { IsString, IsNumber, IsOptional } from 'class-validator';

export class EditPostDto {
  @IsString()
  public title: string;

  @IsString()
  public content: string;

  @IsNumber()
  @IsOptional()
  public categoryId: string;
}

export default EditPostDto;