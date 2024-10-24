import { ArgumentMetadata, ParseUUIDPipe } from '@nestjs/common';

export class OptionalParseUUIDPipe extends ParseUUIDPipe {
    override transform(value: any, metadata: ArgumentMetadata) {
        if (value === undefined) {
            return value;
        }

        return super.transform(value, metadata);
    }
}
