import { ArgumentMetadata, ParseEnumPipe } from '@nestjs/common';

export class OptionalParseEnumPipe<T = any> extends ParseEnumPipe<T> {
    override async transform(value: T, metadata: ArgumentMetadata): Promise<T> {
        if (value === undefined) {
            return value;
        }

        return super.transform(value, metadata);
    }
}
