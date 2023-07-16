import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(private dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
  }
  async getOrCreate(name: string): Promise<Category> {
    const categoryName = name.trim().toLowerCase(); //사이드 공백 제거 후 소문자 변환
    const categorySlug = categoryName.replace(/ /g, '-'); //띄어쓰기 전부 "-" 변환
    let category = await this.findOne({
      where: { slug: categorySlug },
    });
    //카테고리의 슬러그가 없다면 새롭게 만들어서 넣는다.
    if (!category) {
      category = await this.save(
        this.create({ slug: categorySlug, name: categoryName }),
      );
    }
    return category;
  }
}
