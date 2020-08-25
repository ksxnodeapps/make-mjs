import { writeFile } from 'fs-extra'
import { File } from './types'

export const enum EventType {
  BeforeWrite = 'BeforeWrite',
  AfterWrite = 'AfterWrite',
}

abstract class Event {
  public abstract readonly type: EventType
  constructor(public readonly file: File) {}
}

export class BeforeWriteEvent extends Event {
  public readonly type = EventType.BeforeWrite
}

export class AfterWriteEvent extends Event {
  public readonly type = EventType.AfterWrite
}

export async function* write(files: AsyncIterable<File>) {
  for await (const file of files) {
    yield new BeforeWriteEvent(file)
    await writeFile(file.path, file.content)
    yield new AfterWriteEvent(file)
  }
}

export default write
