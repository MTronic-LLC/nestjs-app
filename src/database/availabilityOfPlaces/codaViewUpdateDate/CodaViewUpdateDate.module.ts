import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CodaViewUpdateDateService } from './CodaViewUpdateDate.service';
import { CodaViewUpdateDate } from './CodaViewUpdateDate.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'CodaViewUpdateDate', schema: CodaViewUpdateDate }])],
    providers: [CodaViewUpdateDateService],
    exports: [CodaViewUpdateDateService],
})
export class CodaViewUpdateDateModule {}